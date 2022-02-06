import moralis from 'moralis'
import axios from 'axios'
import { createStore, useStoreState, useStoreActions, action, thunk } from 'easy-peasy'
import { ConnectUserType, EarningsType, liquidityPoolsType, StoreActions, StoreActionsParams, StoreActionType, StoreState, StoreStateParam, StoreType, } from './store.model';
import _ from 'lodash'
import { percentage, weightedMean } from '../utils/weightedMean';

const store = createStore<StoreType>({
    data: {
        user: {
            address: '',
            label: '',
            network: 'polygon',
        },
        earnings: {
            farmingBalance: {
                amount: 0,
                apy: 0,
            },
            yearly: {
                amount: 0,
                apy: 0,
            },
            weekly: {
                amount: 0,
                apy: 0,
            },
            daily: {
                amount: 0,
                apy: 0,
            },
        },
        liquidityPools: []
    },
    connectUser: action<StoreType, ConnectUserType>((state, payload) => {
        const address = payload.address
        state.data.user.address = address
        state.data.user.label = `${address.substring(0, 5)}...${address.substring(address.length-3, address.length)}`
    }), 
    login: thunk<StoreActionType, void, any, StoreType>(async (actions, payload, store) => {
        try {
            let user: any = moralis.User.current();
            if (!user) {
              user = await moralis.authenticate({ signingMessage: "Login on YieldBoard" })
              const userAddress = user.get("ethAddress")
              actions.connectUser({ address: userAddress })
              actions.getPoolsData(userAddress)
            }
        } catch (e) {
            console.error(e)
        }
    }),
    addEarnings: action<StoreType, EarningsType>((state, payload) => { 
        state.data.earnings = payload
    }),
    addLiquidityPools: action<StoreType, liquidityPoolsType[]>((state, payload) => { 
        state.data.liquidityPools = payload
    }),
    getPoolsData: thunk<StoreActionType, string, any, StoreType>(async (actions, address, store) => {
        try {
            const userPoolBalances = await axios.get(`https://api.zapper.fi/v1/protocols/quickswap/balances?newBalances=true&network=polygon&api_key=96e0cc51-a62e-42ca-acee-910ea7d2a241&addresses[]=${address}`)
            const userPoolData = userPoolBalances.data[address].products
                .flatMap((val: any) => val.assets.map((asset: any) => {
                    const tokenVals = asset.tokens.flatMap((tokens: any) => tokens.tokens.map((token: any) => {
                        return {
                            name: token.symbol,
                            amount: token.balanceUSD,
                            logo: token.tokenImageUrl,
                        }
                    }))
                    return {
                        protocolUrl: asset.appImageUrl,
                        amount: asset.balanceUSD,
                        yearly: asset.yearlyROI,
                        weekly: asset.weeklyROI,
                        daily: asset.dailyROI,
                        pairs: tokenVals,
                    }
                }))
            const totalAmount = userPoolBalances.data[address].meta[0].value
            const yearlyApys = userPoolData.map((usData: any) => usData.yearly)
            const weeklyApys = userPoolData.map((usData: any) => usData.weekly)
            const dailyApys = userPoolData.map((usData: any) => usData.daily)
            const weights = userPoolData.map((usData: any) => percentage(usData.amount, totalAmount))
            const yearlyWeighedApy = weightedMean(yearlyApys, weights)
            const weeklyWeighedApy = weightedMean(weeklyApys, weights)
            const dailyWeighedApy = weightedMean(dailyApys, weights)
            const earnings = {
                farmingBalance: {
                    amount: +totalAmount.toFixed(2),
                    apy: (yearlyWeighedApy * 100),
                },
                yearly: {
                    amount: +(totalAmount * yearlyWeighedApy).toFixed(2),
                    apy: (yearlyWeighedApy * 100),
                },
                weekly: {
                    amount: +(totalAmount * weeklyWeighedApy).toFixed(2),
                    apy: (weeklyWeighedApy * 100),
                },
                daily: {
                    amount: +(totalAmount * dailyWeighedApy).toFixed(2),
                    apy: (dailyWeighedApy * 100),
                },
            }
            actions.addEarnings(earnings)
            const liquidityPools = userPoolData.map((pool: any) => {
                const { amount, yearly, weekly, daily, protocolUrl, pairs } = pool
                let newPairs = [...pairs]
                const vestedPool = newPairs.splice(-1)[0]
                return {
                    amount: +amount.toFixed(2),
                    protocolUrl,
                    pairs: newPairs,
                    vested: vestedPool.amount,
                    yearly,
                    weekly,
                    daily,
                }
            })
            actions.addLiquidityPools(liquidityPools)
        } catch (e) {
            console.error(e)
        }
    }),
})

export const useAppActions = (action: StoreActionsParams) => {
    return useStoreActions<StoreActions>(action)
}

export const useAppState = (state: StoreStateParam) => {
    return useStoreState<StoreState>(state)
}

export default store;
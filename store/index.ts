import moralis from 'moralis'
import axios from 'axios'
import { createStore, useStoreState, useStoreActions, action, thunk } from 'easy-peasy'
import { ConnectUserType, StoreActions, StoreActionsParams, StoreActionType, StoreState, StoreStateParam, StoreType, } from './store.model';
import _ from 'lodash'

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
        }
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
              console.log("logged in user:", user);
              const userAddress = user.get("ethAddress")
              console.log(userAddress);
              actions.connectUser({ address: userAddress })
              actions.getPoolsData(userAddress)
            }
        } catch (e) {
            console.error(e)
        }
    }),
    getPoolsData: thunk<StoreActionType, string, any, StoreType>(async (actions, address, store) => {
        try {
            const userPoolBalances = await axios.get(`https://api.zapper.fi/v1/protocols/quickswap/balances?newBalances=true&network=polygon&api_key=96e0cc51-a62e-42ca-acee-910ea7d2a241&addresses[]=${address}`)
            const farms = await axios.get(`https://api.zapper.fi/v1/protocols/quickswap/farms?network=polygon&api_key=96e0cc51-a62e-42ca-acee-910ea7d2a241`)
            console.log('userPools', userPoolBalances.data[address])
            console.log('farms', farms.data)
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
import type { NextPage } from 'next'
import _ from 'lodash'
import Head from 'next/head'
import Image from 'next/image'
import moralis from 'moralis'
import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import EarningStatus from '../components/EarningStatus'
import LiquidityPool from '../components/LiquidityPool'
import { useAppActions, useAppState } from '../store'
import { EarningsType, liquidityPoolsType, UserType } from '../store/store.model'

const Home: NextPage = () => {
  const userData: UserType = useAppState((state) => state.data.user)
  const earnings: EarningsType = useAppState((state) => state.data.earnings)
  const liquidityPools: liquidityPoolsType[] = useAppState((state) => state.data.liquidityPools)
  const login = useAppActions(actions => actions.login)
  const connectUser = useAppActions(actions => actions.connectUser)
  const getPoolsData = useAppActions(actions => actions.getPoolsData)

  useEffect(() => {
    const user = moralis.User.current()
    if (user) {
      const userAddress = user.get("ethAddress")
      connectUser({ address: userAddress })
      getPoolsData(userAddress)
    }
  }, [userData])
  return (
    <div className="w-full h-full">
      <Head>
        <title>YieldBoard</title>
        <meta name="description" content="Yield Farming Dashboard for DeFi Degens." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        <header className="w-full flex mb-8">
            <p className='spartan font-black text-white text-2xl leading-none'>
                Yield<br/>Board
            </p>
            <div className="ml-auto flex md:space-x-5">
                <div 
                  className="flex items-center p-3 px-4 rounded-full font-medium cursor-pointer" style={{ background: '#262837' }}
                  onClick={login}
                >
                    {!userData.address && 
                      <>
                        <img className='mr-2' src="/metamask.png" alt="MetaMask" />
                        <span>CONNECT</span>
                      </>
                    }
                    {userData.address && 
                       <span className="font-extrabold">{userData.label}</span>
                    }
                </div>
            </div>
        </header>
        <div style={{ maxWidth: 1400 }} className="flex flex-col justify-center">
          <div className="flex flex-col space-y-4 md:space-y-0 items-center md:flex-row w-full justify-between mb-16">
            <EarningStatus title="Farming balance" amount={earnings.farmingBalance.amount} apy={earnings.farmingBalance.apy} />
            <EarningStatus title="Yearly earnings" amount={earnings.yearly.amount} apy={earnings.yearly.apy} />
            <EarningStatus title="Weekly earnings" amount={earnings.weekly.amount} apy={earnings.weekly.apy} />
            <EarningStatus title="Daily earnings" amount={earnings.daily.amount} apy={earnings.daily.apy} />
          </div>
          <div className="w-full">
            <p className="text-lg font-bold text-gray-400 mb-5">Liquidity pools</p>
            <div className="grid grid-rows-1 md:grid-cols-3 gap-12">
              {liquidityPools.map((pool, i) => {
                const apy = pool.yearly * 100
                const dailyUSD = +(pool.amount * pool.daily).toFixed(2)
                return (
                  <LiquidityPool
                    key={i}
                    protocol={pool.protocolUrl}
                    amount={pool.amount}
                    apy={apy}
                    daily={dailyUSD}
                    vested={pool.vested}
                    pair1={pool.pairs[0]}
                    pair2={pool.pairs[1]}
                  />
                )
              })}
              {liquidityPools.length === 0 &&
                <>
                <LiquidityPool
                  protocol="https://bitcoinist.com/wp-content/uploads/2021/08/quickswap-img.png"
                  amount={0}
                  apy={0}
                  daily={0}
                  vested={0}
                  pair1={{ 
                    name: 'USDC',
                    logo: 'data:image/png;base64,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'
                  }}
                  pair2={{ 
                    name: 'USDT',
                    logo: 'https://iconape.com/wp-content/png_logo_vector/tether-usdt-logo.png'
                  }}
                />
                <LiquidityPool
                  protocol="https://bitcoinist.com/wp-content/uploads/2021/08/quickswap-img.png"
                  amount={0}
                  apy={0}
                  daily={0}
                  vested={0}
                  pair1={{ 
                    name: 'WBTC',
                    logo: 'https://cryptologos.cc/logos/wrapped-bitcoin-wbtc-logo.png'
                  }}
                  pair2={{ 
                    name: 'ETH',
                    logo: 'https://logowik.com/content/uploads/images/ethereum3649.jpg'
                  }}
                />
                <LiquidityPool
                  protocol="https://bitcoinist.com/wp-content/uploads/2021/08/quickswap-img.png"
                  amount={0}
                  apy={0}
                  daily={0}
                  vested={0}
                  pair1={{ 
                    name: 'MATIC',
                    logo: 'data:image/png;base64,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'
                  }}
                  pair2={{ 
                    name: 'QUICK',
                    logo: 'https://bitcoinist.com/wp-content/uploads/2021/08/quickswap-img.png'
                  }}
                />
                </>}
            </div>
          </div>
        </div>
      </Layout>
    </div>
  )
}

export default Home

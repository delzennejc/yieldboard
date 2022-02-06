import { ReactNode } from "react"

interface LiquidityPoolType {
    amount: number;
    apy: number;
    daily: number;
    vested: number;
    protocol: string;
    pair1: {
        name: string;
        logo: string;
    };
    pair2: {
        name: string;
        logo: string;
    };
}

const LiquidityPool = ({ amount, apy, daily, vested, protocol, pair1, pair2 }: LiquidityPoolType) => {
    return (
        <main 
            style={{ background: "#292B38", width: 345, height: 350 }} 
            className={`flex flex-col justify-between rounded-3xl py-10 px-9`}
        >
            <div className="flex justify-between">
                <div>
                    <p className="text-4xl font-extrabold mb-2">${amount}</p>
                    <div 
                        style={{ background: "#283C2F" }} 
                        className={`inline-block px-2 py-1 text-xs text-green-500 md:text-sm font-extrabold justify-center self-start rounded-full`}
                    >
                        {apy}% APY
                    </div>
                </div>
                <div 
                    style={{ 
                        width: "54px", 
                        height: "54px",
                        backgroundImage: `url(${protocol})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }} 
                    className="rounded-full overflow-hidden"
                >
                </div>
            </div>
            <div className="flex justify-around">
                <div className="flex items-center">
                    <div 
                        style={{ 
                            width: "32px", 
                            height: "32px",
                            backgroundImage: `url(${pair1.logo})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                        }} 
                        className="rounded-full overflow-hidden mr-2"
                    >
                    </div>
                    <p  className="text-xl font-extrabold text-gray-200">{pair1.name}</p>
                </div>
                <div className="w-1 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex items-center">
                    <div 
                        style={{ 
                            width: "32px", 
                            height: "32px",
                            backgroundImage:  `url(${pair2.logo})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                        }} 
                        className="rounded-full overflow-hidden mr-2"
                    >
                    </div>
                    <p  className="text-xl font-extrabold text-gray-200">{pair2.name}</p>
                </div>
            </div>
            <div className="flex justify-between">
                <div className="flex flex-col items-center">
                    <p className="text-xl font-extrabold mb-1">${daily}</p>
                    <p className="text-lg font-bold text-gray-400">per day</p>
                </div>
                <div className="flex flex-col items-center">
                    <p className="text-xl font-extrabold mb-1">${vested}</p>
                    <p className="text-lg font-bold text-gray-400">vested</p>
                </div>
            </div>
        </main>
    )
}

export default LiquidityPool;
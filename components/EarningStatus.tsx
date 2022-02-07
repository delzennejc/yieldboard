import { ReactNode } from "react"

interface EarningStatusType {
    title: string;
    amount: number;
    apy: number;
}

const EarningStatus = ({ title, amount, apy }: EarningStatusType) => {
    const showApy = apy < 0.01 && apy > 0 ? "<0.01% APY" : `${isNaN(apy) ? 0 : apy.toFixed(2)}% APY`
    const showAmount = isNaN(amount) ? 0 : amount
    return (
        <main 
            style={{ background: "#292B38", width: 250 }} 
            className={`flex flex-col items-center rounded-2xl py-6`}
        >
            <p className="text-lg font-bold text-gray-400 mb-5">{title}</p>
            <p className="text-4xl font-extrabold mb-5">${showAmount}</p>
            <div 
                style={{ background: "#283C2F" }} 
                className={`inline-block px-2 py-1 text-xs text-green-500 md:text-sm font-extrabold justify-center self-center rounded-full`}
            >
                {showApy}
            </div>
        </main>
    )
}

export default EarningStatus;
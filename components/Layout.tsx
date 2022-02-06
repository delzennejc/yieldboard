import { ReactElement, ReactNode } from "react";

interface LayoutType {
    children: ReactNode;
}

const Layout = ({ children }: LayoutType) => {
    return (
        <div className="flex flex-col items-center w-full h-full min-h-screen px-6 md:px-20 pt-8 pb-14">
            {children}
        </div>
    )
}

export default Layout;
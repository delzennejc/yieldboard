import React, {useEffect, useState} from "react";

const useDeviceDetect = () => {
    if (typeof window === 'undefined') return false
    const [width, setWidth] = useState(window.innerWidth);
    const handleWindowResize = () => {
        setWidth(window.innerWidth);
    }

    useEffect(() => {
        window.addEventListener('resize', handleWindowResize);
        return () => {
            window.removeEventListener('resize', handleWindowResize);
        }
    }, []);

    return (width <= 768);
}

export default useDeviceDetect
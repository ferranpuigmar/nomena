import React from "react"

export const useIsMobile = () => {
    const [isMobile, setIsMobile] = React.useState(() => window.matchMedia('(max-width: 767px)').matches)

    React.useEffect(() => {
        const mq = window.matchMedia('(max-width: 767px)')
        const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
        mq.addEventListener('change', handler)
        return () => mq.removeEventListener('change', handler)
    }, [])

    return isMobile
}
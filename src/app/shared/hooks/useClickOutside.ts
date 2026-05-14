import React, { useCallback } from "react"

interface UseClickOutsideProps {
    ref: React.RefObject<HTMLElement> | null;
    handler: (event: Event) => void;
    eventListener?: keyof DocumentEventMap;
    listenOn?: 'document' | 'ref';
    enabled?: boolean;
}

export const useClickOutside = ({
    ref,
    handler,
    eventListener = 'mousedown',
    listenOn = 'document',
    enabled = true,
}: UseClickOutsideProps) => {

    const handleClickOutside = useCallback((event: Event) => {
        if (!enabled || !ref?.current) {
            return
        }

        if (listenOn === 'ref') {
            const mouseEvent = event as MouseEvent
            if (mouseEvent.relatedTarget && ref.current.contains(mouseEvent.relatedTarget as Node)) {
                return
            }
            handler(event)
            return
        }

        if (!ref.current.contains(event.target as Node)) {
            handler(event)
        }
    }, [enabled, ref, listenOn, handler]);

    React.useEffect(() => {
        if (!enabled || !ref?.current) {
            return
        }

        const target = listenOn === 'ref' ? ref.current : document
        target.addEventListener(eventListener, handleClickOutside as EventListener)

        return () => target.removeEventListener(eventListener, handleClickOutside as EventListener)
    }, [enabled, ref, listenOn, handleClickOutside, eventListener])
}

import { useState, useEffect } from "react";

export const useEventListener = <T>(eventName: string, defaultValue: T) => {
    const [data, setData] = useState<T>(defaultValue);

    useEffect(() => {
        const handler = (event: CustomEvent<T>) => {
            setData(event.detail);
        }

        window.addEventListener(eventName, handler as EventListener);
        return () => window.removeEventListener(eventName, handler as EventListener);
    }, [eventName]);

    return data;
};
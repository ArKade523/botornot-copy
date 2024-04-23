import { useContext, useEffect, useState } from "react";
import { ApiContext } from "../utils/api";

export function useApi() {
    const api = useContext(ApiContext);
    const [_, forceUpdate] = useState({}); // State used to force update

    useEffect(() => {
        const handleUpdate = () => {
            forceUpdate({}); // Change state to force re-render
        };

        api?.subscribe(handleUpdate);
        return () => {
            api?.unsubscribe(handleUpdate);
        };
    }, [api]);

    return api;
}
import { useContext } from "react";
import { PeerContext } from "../providers/PeerContext";

export function usePeer() {
    const context = useContext(PeerContext)
    if (!context) {
        throw new Error("usePeer must be used within PeerProvider")
    }
    return context
}





import { RoomContext } from "../providers/RoomContext";
import { useContext } from "react";

export function useRoom() {
    const context = useContext(RoomContext)
    if (!context) {
        throw new Error("useRoom must be used within RoomProvider")
    }
    return context
}
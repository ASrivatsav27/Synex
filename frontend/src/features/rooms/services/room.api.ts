import axios from "axios";
import type { RoomResponse } from "../types/room.types";
const api = axios.create({
    baseURL: "http://localhost:8000/rooms",
    withCredentials:true
})


export async function createRoom():Promise<RoomResponse> {
    const { data } = await api.post("/create")
    return data
}
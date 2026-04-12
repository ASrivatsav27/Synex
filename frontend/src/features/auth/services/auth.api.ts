import axios from "axios";
import type { RegisterPayload,LoginPayload,AuthResponse } from "../types/auth.types";


const api = axios.create({
    baseURL: "http://localhost:8000/auth", 
    withCredentials: true
})




export const login = async (payload: LoginPayload):Promise<AuthResponse> => {
    const { data } = await api.post('/login', payload)
    return data
}

export const register = async (payload: RegisterPayload):Promise<AuthResponse> => {
    const { data } = await api.post('/register', payload)
    return data
}

export const logout = async ():Promise<void> => {
    await api.post("/logout")
}
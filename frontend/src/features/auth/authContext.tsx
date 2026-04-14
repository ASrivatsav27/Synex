import { createContext, type ReactNode } from "react"
import { register, login, logout } from "./services/auth.api"
import { useState } from "react"
import type { RegisterPayload, LoginPayload, User } from "./types/auth.types"


type AuthContextType = {
  user: User | null
  loading: boolean
  handleRegister: (payload: RegisterPayload) => Promise<void>
  handleLogin: (payload: LoginPayload) => Promise<void>
  handleLogout: () => Promise<void>
}



export const AuthContext = createContext<AuthContextType | null>(null)


type AuthProviderProps = {
    children: ReactNode
}

export function AuthProvider({children}:AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(false);

    const handleRegister = async (payload: RegisterPayload) => {
        setLoading(true)
        try {
            const data = await register(payload)
            setUser(data.user)
        } catch (err) {
            console.log(err)
            throw err
        } finally {
            setLoading(false)
        }
    }
     
    const handleLogin = async (payload: LoginPayload) => {
        setLoading(true)
        try {
            const data = await login(payload)
            setUser(data.user)
        } catch (err) {
            console.log(err)
            throw err
        } finally {
            setLoading(false)
        }
    }
    
    const handleLogout = async () => {
        setLoading(true)
        try {
            await logout()
            setUser(null)
        } catch (err) {
            console.log(err)
            throw err
        } finally {
            setLoading(false)
        }
    }
    


return (<AuthContext.Provider
        value={{
          user,loading,handleRegister,handleLogin,handleLogout
      }}>
          {children}
        
      </AuthContext.Provider>)
    
    
    





    
}


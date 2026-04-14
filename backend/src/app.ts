import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:5173",
    credentials:true
}))
import authRouter from "./features/auth/auth.routes.js"
app.use("/auth",authRouter)

import roomRouter from "./features/rooms/room.routes.js"
app.use("/rooms",roomRouter)



export default app
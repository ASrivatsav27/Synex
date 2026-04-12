import express from "express"
import {registerController,loginController,logoutController} from "./auth.controller.js"
const authRouter = express()


authRouter.post('/register', registerController)
authRouter.post('/login', loginController)
authRouter.post('/logout',logoutController)




export default authRouter
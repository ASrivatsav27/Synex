import express from "express"
import { registerController, loginController, logoutController } from "./auth.controller.js"
import { authUser } from "../../middlewares/auth.middleware.js"
const authRouter = express()


authRouter.post('/register', registerController)
authRouter.post('/login', loginController)
authRouter.post('/logout',authUser,logoutController)




export default authRouter
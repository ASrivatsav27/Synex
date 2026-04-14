import express from "express"
import { authUser } from "../../middlewares/auth.middleware.js"
import { createRoomController } from "./room.controller.js"

const roomRouter = express.Router()

roomRouter.post('/create',authUser,createRoomController)


export default roomRouter
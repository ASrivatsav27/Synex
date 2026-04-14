import mongoose from "mongoose";
import roomModel from "./room.model.js";
import type { Request ,Response} from "express";


export async function createRoomController(req: Request, res: Response) {
    
    
    const roomId = new mongoose.Types.ObjectId().toString()
    if (!req.user) {
     return res.status(401).json({ message: "Unauthorized" });
    }
    const userId = new mongoose.Types.ObjectId(req.user.userId)
    const room = await roomModel.create({ roomId, createdBy:userId})
    
    res.status(201).json({
        message:"Room created successfully",room
    })



}

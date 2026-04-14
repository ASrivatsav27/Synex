import mongoose, { Schema, Types, model } from "mongoose"


type Room = {
    roomId: string
    createdBy: Types.ObjectId

}


const roomSchema = new Schema<Room>({
    roomId: {
        type: String,
        unique: [true, "RoomId already exists"],
        required:[true,"RoomId is required"]
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required:[true,"Required"]
    }
}, {
 timestamps: true
})

const roomModel = model<Room>("rooms", roomSchema)


export default roomModel
import { Schema, model } from "mongoose"

type User = {
    username: string
    email: string
    password: string
}


const userSchema = new Schema<User>({
   username: {
    type: String,
    unique: [true, "Username already exists"],
    required: [true, "Username is required"],
  },

  email: {
    type: String,
    required: [true, "Email is required"],
    unique: [true, "Email already exists"],
  },

  password: {
    type: String,
    select: false,
    required: [true, "Password is required"],
  }
})

const userModel = model<User>("users", userSchema)


export default userModel
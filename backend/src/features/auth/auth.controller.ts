import userModel from "./user.model.js";
import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt, { type Jwt } from "jsonwebtoken"
import redis from "../../config/cache.js";
export async function registerController(req:Request,res:Response) {
    
    const { username, email, password } = req.body
    
    if (!password || !username || !email) {
        return res.status(404).json({
            message:"User details are required"
        })
    }
   
    const userAlreadyExists = await userModel.findOne({
        $or:[{email},{username}]
    })
   
    if (userAlreadyExists) {
        return res.status(409).json({
            message:"User already exists"
        })
    }

    const hash = await bcrypt.hash(password, 10)
    
    const user = await userModel.create({
        username,
        email,
        password:hash
    })

    type JwtPayload = {
        userId: string,
        email: string,
        username: string
    }
   
    const secret = process.env.JWT_SECRET
    if(!secret) throw new Error("JWT SECRET is required")
 
    const token = jwt.sign({
        userId: user._id.toString(),
        email: user.email,
        username: user.username
    } as JwtPayload, secret, { expiresIn: "3d"} )
    
    res.cookie("jwt_token",token)
   
    const User =  {
        email: user.email,
        username: user.username,
    }
   
    res.status(201).json({
        message: "Registered successfully",User
    })

}


export async function loginController(req:Request,res:Response) {
    const { email, password } = req.body
    if (!password || !email) {
     return res.status(400).json({ message: "Email and password are required",});
    }
    
    const user = await userModel.findOne({ email }).select("+password")
    
    if (!user) {
        return res.status(404).json({
            message:"User does'nt exist"
        })
    }
    
    const isPasswordCorrect = await bcrypt.compare(password, user.password)

    if (!isPasswordCorrect) {
        return res.status(401).json({
            message:"Incorrect password"
        })
    }
    
    type JwtPayload = {
        userId: string
        email: string
        username: string
    }
    
    const secret = process.env.JWT_SECRET
    if (!secret) throw new Error("JWT_SECRET is not defined")
    
    const token = jwt.sign({
        userId: user._id.toString(),
        email: user.email,
        username: user.username
    }as JwtPayload,secret,{expiresIn:'3d'})
    
    res.cookie("jwt_token", token)
    
    const User =  {
        email: user.email,
        username: user.username,
    }
   
    res.status(201).json({
        message:"Logged in successfully",User
    })
  

}

export async function logoutController(req: Request, res: Response) {
    const token = req.cookies.jwt_token
    res.clearCookie('jwt_token')
    await redis.set(token, 'blacklisted', 'EX', 60 * 60)
     res.status(200).json({ message: 'Logged out successfully' })
  
}
import jwt from "jsonwebtoken"
import redis from "../config/cache.js"
import type { Request, Response, NextFunction } from "express"
import type { JwtPayload } from "jsonwebtoken"


export async function authUser(req:Request,res:Response,next:NextFunction) {
    const token = req.cookies.jwt_token

    if (!token) {
        return res.status(401).json({
            message: "Token not found"
        })
    }
    
    const isTokenBlacklisted = await redis.get(token)

    if (isTokenBlacklisted) {
        return res.status(401).json({
            message:"Invalid Token"
        })
    }
   const secret = process.env.JWT_SECRET

    if (!secret) {
    throw new Error("JWT_SECRET is not defined")

    }
    
    let decoded: string | JwtPayload
     
    try {
        decoded = jwt.verify(token, secret)
        if (typeof decoded === "string") {
            return res.status(401).json({
               message: "Invalid token format"
            })
        }
    
    } catch (err) {
        return res.status(404).json({
            message:"Invalid token"
        })
    }

    req.user = decoded
  
    next()


}
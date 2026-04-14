import jwt from "jsonwebtoken"
import redis from "../config/cache.js"
import type { Request, Response, NextFunction } from "express"
import type { JwtPayload } from "jsonwebtoken"
import type { Socket } from "socket.io"


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
type AuthPayload = JwtPayload & { userId?: string; email?: string; username?: string };

interface AuthSocket extends Socket {
  user?: AuthPayload;
}
export async function socketAuth(socket: AuthSocket, next: (err?: Error) => void) {
    
     try {
    const cookie = socket.handshake.headers.cookie;

    if (!cookie) {
      return next(new Error("No cookie found"));
    }
    const token = cookie
      .split("; ")
      .find((c) => c.startsWith("jwt_token="))
      ?.split("=")[1];

    if (!token) {
      return next(new Error("Token not found"));
    }

    
    const isBlacklisted = await redis.get(token);
    if (isBlacklisted) {
      return next(new Error("Token blacklisted"));
    }

   
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET not defined");

    const decoded = jwt.verify(token, secret);

    if (typeof decoded === "string") {
      return next(new Error("Invalid token"));
    }
    socket.user = decoded;

    next();

  } catch (err) {
    next(new Error("Unauthorized"));
  }
}
import "dotenv/config"
import app from "./src/app.js";
import connectDb from "./src/config/database.js";

import http from "http"
import { Server } from "socket.io";
import { socketAuth } from "./src/middlewares/auth.middleware.js";
connectDb()
const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true,
  }
})

const userIdToSocketMapping = new Map()
const socketToUserIdMapping = new Map()

io.use(socketAuth)
io.on("connection", (socket: any) => {
  console.log("User Connected:", socket.user?.userId);

  socket.on("join-room", ({ roomId }:{roomId:string}) => {
    const userId = socket.user.userId;

    socket.data.roomId = roomId;
    socket.join(roomId);

    console.log(`${userId} joined ${roomId}`);
    userIdToSocketMapping.set(userId, socket.id)
    socketToUserIdMapping.set(socket.id,userId)

    socket.to(roomId).emit("user-joined", { userId });
  });

  socket.on("message-listen", ({ roomId, message }: { roomId: string; message: string }) => {
    if (!roomId) {
      console.log("No roomId provided for message broadcast");
      return;
    }

    const username = socket.user?.username ?? "Unknown";

    io.to(roomId).emit("message", {
      message,
      username,
    });
  })
  
  socket.on("call-user", ({ userId, offer }: { userId: string; offer: unknown }) => {
    const fromUser = socketToUserIdMapping.get(socket.id)

    const socketId = userIdToSocketMapping.get(userId)
    if (!socketId) {
      console.log("Cannot find target socket for user", userId)
      return
    }

    socket.to(socketId).emit("incoming-call", {
      from: fromUser,
      offer,
    })
   })

  socket.on("call-accepted", ({ userId, answer }: { userId: string; answer: unknown }) => {
    const socketId = userIdToSocketMapping.get(userId)
    if (!socketId) {
      console.log("Cannot find target socket for accepted call", userId)
      return
    }
    socket.to(socketId).emit("call-accepted", { answer })
  })

  socket.on("ice-candidate", ({ roomId, candidate }: { roomId: string; candidate: RTCIceCandidateInit }) => {
    if (!roomId || !candidate) {
      return
    }
    socket.to(roomId).emit("ice-candidate", { candidate })
  })

  socket.on("disconnect", () => {
    const userId = socketToUserIdMapping.get(socket.id)
    if (userId) {
      userIdToSocketMapping.delete(userId)
    }
    socketToUserIdMapping.delete(socket.id)
  })




})

server.listen(8000, () => {
    console.log("Server is running on port 8000")
})
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
io.use(socketAuth)
io.on("connection", (socket: any) => {
  console.log("User Connected:", socket.user?.userId);

  socket.on("join-room", ({ roomId }:{roomId:string}) => {
    const userId = socket.user.userId;

    socket.data.roomId = roomId;
    socket.join(roomId);

    console.log(`${userId} joined ${roomId}`);

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
})

server.listen(8000, () => {
    console.log("Server is running on port 8000")
})
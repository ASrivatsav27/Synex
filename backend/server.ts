import "dotenv/config"
import app from "./src/app.js";
import connectDb from "./src/config/database.js";

import http from "http"
import { Server } from "socket.io";

connectDb()
const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true,
  }
})


server.listen(8000, () => {
    console.log("Server is running on port 8000")
})
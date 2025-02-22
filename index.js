import express from "express";
import dotenv from "dotenv";
import path from "path";
import http from "http";
import connectDB from "./db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import Message from "./models/message.js";
import { Server } from "socket.io";

dotenv.config();

const PORT = process.env.PORT;
connectDB();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {

  socket.on("join", (userId) => {
    socket.join(userId);
  });

  socket.on("sendMessage", async ({ sender, receiver, message }) => {
    const newMessage = new Message({ sender, receiver, message });
    await newMessage.save();

    io.to(receiver).emit("receiveMessage", { sender, message });
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const __dirname = path.dirname(new URL(import.meta.url).pathname);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/messages", messageRoutes);
app.get("/", (req, res) => {
  res.send("Welcome to Linkify");
});
app.get("*", (req, res) => {
  res.send("Welcome to Linkify");
});

server.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

export default app;

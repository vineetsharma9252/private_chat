import express from "express";
import mongoose from "mongoose";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";
import user from "./models/Users.js"; // your Mongoose model
import dotenv from "dotenv";
dotenv.config(); // loads variables from .env into process.env

// console.log(process.env.PORT); // 3000

console.log(process.env.MONGOOSE_CONNECTION_STRING);

// ⚙️ Connect to MongoDB
mongoose
  .connect(`${process.env.MONGOOSE_CONNECTION_STRING}`)
  .then(() => console.log("✅ Database connected successfully"))
  .catch((error) => console.log("❌ DB connection error: " + error));

// ✅ Setup Express
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: `${process.env.FRONTEND_URL}`,
    methods: ["GET", "POST"],
  })
);

// 🟢 HTTP server required for socket.io
const server = http.createServer(app);

// ✅ Initialize socket.io
const io = new Server(server, {
  cors: {
    origin: `${process.env.FRONTEND_URL}`, // frontend port
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// 🔌 Socket.IO Events
io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  socket.on("join_room", (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);
  });

  socket.on("send_message", (data) => {
    // data = { roomId, sender, message, time }
    console.log(
      `💬 Message from ${data.sender} in room ${data.roomId}: ${data.message}`
    );
    io.to(data.roomId).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

// ✅ Express Routes
app.post("/signup", async (req, res) => {
  const { username, password, email, phone } = req.body;
  if (!username || !password || !email) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const existingUser = await user.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ error: "Email already exists" });
  }

  const newUser = new user({ username, password, email, phone });
  await newUser.save();
  res.status(201).json({ message: "User registered", user: newUser._id });
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const findUser = await user.findOne({ username, password });
    if (findUser) {
      res.status(200).json({ message: "Login successful", user: findUser._id });
    } else {
      res.status(401).json({ error: "Invalid username or password" });
    }
  } catch (error) {
    res.status(500).json({ error: "Server error", message: error });
  }
});

// ✅ Start server with both API & sockets
const PORT = 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on ${PORT}`);
});

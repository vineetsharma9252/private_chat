import express from "express";
import mongoose from "mongoose";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";
import user from "./models/Users.js"; // your Mongoose model
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

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
    origin: "*",
    methods: ["GET", "POST"],
  })
);

// 🟢 HTTP server required for socket.io
const server = http.createServer(app);

// ✅ Initialize socket.io
const io = new Server(server, {
  cors: {
    origin: "*", // frontend port
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

app.post("/signup", async (req, res) => {
  const { username, password, email, phone } = req.body;
  if (!username || !password || !email) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const existingUser = await user.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ error: "Email already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new user({ username, password: hashedPassword, email, phone });
  await newUser.save();

  res.status(201).json({ message: "User registered", user: newUser._id });
});


app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const findUser = await user.findOne({ username });
    if (!findUser) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const isMatch = await bcrypt.compare(password, findUser.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const token = jwt.sign(
      { id: findUser._id, username: findUser.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: "Server error", message: error.message });
  }
});

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(" ")[1];

  if (!token) return res.status(403).json({ error: "Access denied" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(401).json({ error: "Invalid token" });
    req.user = user;
    next();
  });
};

app.get("/protected", verifyToken, (req, res) => {
  res.json({ message: "You accessed a protected route!", user: req.user });
});

// ✅ Start server with both API & sockets
const PORT = 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on ${PORT}`);
});

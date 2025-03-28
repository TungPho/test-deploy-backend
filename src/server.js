const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();

const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: "https://test-deploy-frontend-orpin.vercel.app",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});
app.use(cors());
app.use("/", (req, res, next) => {
  return res.status(200).json({
    message: "Welcome to the server",
  });
});

// Lắng nghe kết nối từ client
io.on("connection", (socket) => {
  console.log("⚡ A user connected:", socket.id);

  socket.on("chat message", (msg) => {
    console.log("📩 Message received:", msg);
    io.to(socket.id).emit("chat message", msg); // Gửi tin nhắn đến tất cả client
  });

  socket.on("disconnect", () => {
    console.log("❌ A user disconnected");
  });
});

// Chạy server trên cổng 3000
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});

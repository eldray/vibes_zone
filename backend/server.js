const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const passport = require("passport");
const session = require("express-session");
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/posts");
const reelRoutes = require("./routes/reels");
const messageRoutes = require("./routes/messages");
const setupSocket = require("./sockets/chat");

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:3000" },
});

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

// Session for Passport.js
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/reels", reelRoutes);
app.use("/api/messages", messageRoutes);

// Serve frontend
app.use(
  "/partials",
  express.static(path.join(__dirname, "../frontend/partials"))
);
app.use(
  "/scripts",
  express.static(path.join(__dirname, "../frontend/scripts"))
);
app.use(express.static(path.join(__dirname, "../frontend")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/base.html"));
});

// Socket.IO setup
setupSocket(io);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

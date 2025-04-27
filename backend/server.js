require("dotenv").config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const SQLiteStore = require("connect-sqlite3")(session);
const passport = require("passport");
const socketIo = require("socket.io");
const http = require("http");
const path = require("path");
const rateLimit = require("./middleware/rateLimit");
const logger = require("./utils/logger");
const errorHandler = require("./middleware/error");
const chatSocket = require("./sockets/chat");
const notificationSocket = require("./sockets/notifications");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: "http://localhost:3000", credentials: true },
});

// Attach io to app
app.set("io", io);

// Middleware
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    store: new SQLiteStore({ db: "sessions.sqlite", dir: "./db" }),
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }, // 1 day
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(rateLimit);
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/posts", require("./routes/posts"));
app.use("/api/reels", require("./routes/reels"));
app.use("/api/messages", require("./routes/messages"));
app.use("/api/stories", require("./routes/stories"));
app.use("/api/hashtags", require("./routes/hashtags"));
app.use("/api/notifications", require("./routes/notifications"));
app.use("/api/users", require("./routes/users"));

// Socket.IO
chatSocket(io);
notificationSocket(io);

// Error Handler
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

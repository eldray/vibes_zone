const db = require("../config/database");

module.exports = (io) => {
  io.on("connection", (socket) => {
    socket.on("sendMessage", ({ to, text, timestamp }) => {
      db.get("SELECT id FROM users WHERE username = ?", [to], (err, user) => {
        if (err || !user)
          return socket.emit("error", { message: "User not found" });
        db.run(
          "INSERT INTO messages (senderId, receiverId, text, timestamp) VALUES (?, ?, ?, ?)",
          [socket.userId, user.id, text, timestamp],
          (err) => {
            if (err) return socket.emit("error", { message: err.message });
            io.emit("receiveMessage", { from: socket.userId, text, timestamp });
          }
        );
      });
    });
  });
};

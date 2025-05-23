module.exports = (io) => {
  io.on("connection", (socket) => {
    socket.on("join", (userId) => {
      socket.join(`user-${userId}`);
    });

    socket.on("sendMessage", (message) => {
      io.to(`user-${message.receiverId}`).emit("newMessage", message);
    });
  });
};

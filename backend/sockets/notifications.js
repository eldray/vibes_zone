module.exports = (io) => {
  io.on("connection", (socket) => {
    socket.on("join", (userId) => {
      socket.join(`user-${userId}`);
    });
  });
};

let ioInstance = null;

const setIo = (io) => {
  ioInstance = io;
};

const emitToUser = (userId, event, payload) => {
  if (!ioInstance) return;
  ioInstance.to(`user_${userId}`).emit(event, payload);
};

const emitToUsers = (userIds, event, payload) => {
  if (!ioInstance || !Array.isArray(userIds)) return;
  userIds.forEach((userId) => emitToUser(userId, event, payload));
};

module.exports = {
  setIo,
  emitToUser,
  emitToUsers,
};

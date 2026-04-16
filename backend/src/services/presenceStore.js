const onlineUsers = new Map(); // userId -> Set(socketId)
const socketToUser = new Map(); // socketId -> userId

const registerSocket = (userId, socketId) => {
  const normalizedUserId = Number(userId);

  if (!onlineUsers.has(normalizedUserId)) {
    onlineUsers.set(normalizedUserId, new Set());
  }

  onlineUsers.get(normalizedUserId).add(socketId);
  socketToUser.set(socketId, normalizedUserId);
};

const unregisterSocket = (socketId) => {
  const userId = socketToUser.get(socketId);
  if (userId === undefined) return;

  const sockets = onlineUsers.get(userId);
  if (sockets) {
    sockets.delete(socketId);
    if (sockets.size === 0) {
      onlineUsers.delete(userId);
    }
  }

  socketToUser.delete(socketId);
};

const isUserOnline = (userId) => onlineUsers.has(Number(userId));

const getActiveUserIds = () => Array.from(onlineUsers.keys());

const getActiveCount = () => onlineUsers.size;

module.exports = {
  registerSocket,
  unregisterSocket,
  isUserOnline,
  getActiveUserIds,
  getActiveCount,
};

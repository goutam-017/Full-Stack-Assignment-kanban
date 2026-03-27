let socket = null;

export const connectSocket = (boardId) => {
  socket = new WebSocket(`ws://localhost:8000/ws/tasks/${boardId}/`);

  socket.onopen = () => {
    console.log("✅ WebSocket Connected");
  };

  socket.onclose = () => {
    console.log("❌ WebSocket Disconnected");
  };

  socket.onerror = (error) => {
    console.error("⚠️ WebSocket Error:", error);
  };

  return socket;
};


export const getSocket = () => socket;
// Socket.io Real-time Client Service

class SocketService {
  constructor() {
    this.socket = null;
    this.init();
  }

  init() {
    if (typeof window !== 'undefined' && window.io) {
      try {
        this.socket = window.io(window.location.origin, {
          transports: ['websocket', 'polling'],
          reconnection: true,
          reconnectionAttempts: 5,
        });

        this.socket.on('connect', () => {
          console.log('[Socket.io Client Connected]:', this.socket.id);
        });

        this.socket.on('disconnect', () => {
          console.log('[Socket.io Client Disconnected]');
        });
      } catch (err) {
        console.warn('Socket.io client initialization skipped:', err);
      }
    }
  }

  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  emit(event, data) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }
}

export const socketService = new SocketService();
export default socketService;

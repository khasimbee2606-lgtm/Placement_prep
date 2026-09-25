// Socket.io Real-time Client Service

class SocketService {
  constructor() {
    this.socket = null;
    this.init();
  }

  init() {
    if (typeof window !== 'undefined' && window.io) {
      try {
        let socketUrl = window.location.origin;
        if (import.meta.env.VITE_BACKEND_URL) {
          socketUrl = import.meta.env.VITE_BACKEND_URL;
        } else if (import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL.startsWith('http')) {
          socketUrl = import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '');
        }

        this.socket = window.io(socketUrl, {
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

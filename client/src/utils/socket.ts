import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

class SocketClient {
    private socket: Socket | null = null;

    connect() {
        if (this.socket?.connected) return;

        this.socket = io(SOCKET_URL, {
            withCredentials: true,
            transports: ['websocket', 'polling']
        });

        this.socket.on('connect', () => {
            console.log('🔌 Connected to Socket.io server');
        });

        this.socket.on('connect_error', (error) => {
            console.error('🔌 Socket connection error:', error);
        });
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    join(room: string) {
        if (this.socket) {
            this.socket.emit('join', room);
        }
    }

    on(event: string, callback: (data: any) => void) {
        if (!this.socket) this.connect();
        this.socket?.on(event, callback);
    }

    off(event: string, callback?: (data: any) => void) {
        this.socket?.off(event, callback);
    }

    emit(event: string, data: any) {
        if (!this.socket) this.connect();
        this.socket?.emit(event, data);
    }
}

export const socketClient = new SocketClient();

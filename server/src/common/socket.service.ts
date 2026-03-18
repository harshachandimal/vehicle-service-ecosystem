import { Server as SocketServer } from 'socket.io';
import { Server as HttpServer } from 'http';

export class SocketService {
    private static io: SocketServer | null = null;

    /**
     * Initialize Socket.io server
     * @param server HTTP server instance
     */
    static init(server: HttpServer): SocketServer {
        this.io = new SocketServer(server, {
            cors: {
                origin: process.env.CLIENT_URL || 'http://localhost:5173',
                methods: ['GET', 'POST'],
                credentials: true
            }
        });

        this.io.on('connection', (socket) => {
            console.log(`🔌 Client connected: ${socket.id}`);

            socket.on('join', (room: string) => {
                socket.join(room);
                console.log(`👤 Client ${socket.id} joined room: ${room}`);
            });

            socket.on('disconnect', () => {
                console.log(`🔌 Client disconnected: ${socket.id}`);
            });
        });

        return this.io;
    }

    /**
     * Get Socket.io instance
     */
    static getInstance(): SocketServer {
        if (!this.io) {
            throw new Error('Socket.io not initialized');
        }
        return this.io;
    }

    /**
     * Emit event to a specific room or to all
     * @param event Event name
     * @param data Data to emit
     * @param room Optional room name
     */
    static emit(event: string, data: any, room?: string): void {
        if (!this.io) return;

        if (room) {
            this.io.to(room).emit(event, data);
        } else {
            this.io.emit(event, data);
        }
    }
}

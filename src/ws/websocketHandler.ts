// src/ws/websocketHandler.ts
import { WebSocketServer, WebSocket } from 'ws';
import { XenovaEmbeddingService } from '../services/xenovaEmbeddingService';

const embeddingService = new XenovaEmbeddingService();

export async function startWebSocketServer(port = 8080): Promise<void> {
    await embeddingService.ready();

    const wss = new WebSocketServer({ port });
    console.log(`WebSocket server started on ws://localhost:${port}`);

    wss.on('connection', (ws: WebSocket) => {
        console.log('Client connected');

        ws.on('message', async (message: Buffer) => {
            const text = message.toString();
            console.log('Received message:', text);

            try {
                const embeddings = await embeddingService.generateEmbeddingChunks(text);
                ws.send(JSON.stringify({ embeddings }));
            } catch (error) {
                console.error('Error generating embeddings:', error);
                ws.send(JSON.stringify({ error: 'Failed to generate embeddings' }));
            }
        });

        ws.on('close', () => {
            console.log('Client disconnected');
        });
    });

    // Handle WebSocket server errors
    wss.on('error', (error) => {
        console.error('WebSocket server error:', error);
    });
}

import { WebSocketServer, WebSocket } from 'ws';
import { XenovaEmbeddingService } from './embedding.js';

const PORT = 8080;
const wss = new WebSocketServer({ port: PORT });
const embeddingService = new XenovaEmbeddingService();

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

console.log('WebSocket server started on ws://localhost:', PORT);

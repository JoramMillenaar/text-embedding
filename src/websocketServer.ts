import { WebSocketServer, WebSocket } from 'ws';
import { XenovaEmbeddingService } from './services/EmbeddingService.js';
import { TokenBasedTextChunkingService } from './services/TextChunkingService.js';

const embeddingService = new XenovaEmbeddingService();
await embeddingService.ready()
const textChunkingService = new TokenBasedTextChunkingService(embeddingService.getMaxTokens());

const PORT = 8080;
const wss = new WebSocketServer({ port: PORT });

wss.on('connection', (ws: WebSocket) => {
    console.log('Client connected');

    ws.on('message', async (message: Buffer) => {
        const text = message.toString();
        console.log('Received message:', text);

        const chunks = await textChunkingService.chunkText(text);

        for (const chunk of chunks) {
            try {
                const embedding = await embeddingService.generateEmbedding(chunk);
                const embeddingArray = Array.isArray(embedding) ? embedding: Object.values(embedding);
                ws.send(JSON.stringify({ chunk, embedding: embeddingArray }));
            } catch (error) {
                ws.send(JSON.stringify({ error: 'Failed to generate embedding' }));
            }
        }

        ws.send(JSON.stringify({ status: 'done' }));
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

console.log('WebSocket server started on ws://localhost:', PORT);

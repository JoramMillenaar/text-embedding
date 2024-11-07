import express, { Request, Response, RequestHandler } from 'express';
import bodyParser from 'body-parser';
import { TokenBasedTextChunkingService } from './services/TextChunkingService.js';
import { XenovaEmbeddingService } from './services/EmbeddingService.js';

const app = express();
app.use(bodyParser.json());

const embeddingService = new XenovaEmbeddingService();
await embeddingService.ready();
const textChunkingService = new TokenBasedTextChunkingService(embeddingService.getMaxTokens());

const embeddingsHandler: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const { text } = req.body;
        if (!text) {
            res.status(400).json({ error: 'Text input is required' });
            return;
        }

        // Process and chunk the text
        const chunks = await textChunkingService.chunkText(text);

        // Generate embeddings and format each chunk with its embedding
        const response = await Promise.all(
            chunks.map(async (chunk) => {
                const embedding = await embeddingService.generateEmbedding(chunk);
                const embeddingArray = Array.isArray(embedding) ? embedding : Object.values(embedding);
                return { chunk, embedding: embeddingArray };
            })
        );
        res.json(response);
    } catch (error) {
        console.error('Error generating embeddings:', error);
        res.status(500).json({ error: 'Failed to generate embeddings' });
    }
};

// Define the /embeddings route with the handler
app.post('/embeddings', embeddingsHandler);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

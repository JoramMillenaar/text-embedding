import express, { Request, Response, RequestHandler } from 'express';
import bodyParser from 'body-parser';
import { MockEmbeddingService } from '../tests/mocks';
import { MockTextProcessingService } from '../tests/mocks';
import { MockTextChunkingService } from '../tests/mocks';

const app = express();
app.use(bodyParser.json());

const embeddingService = new MockEmbeddingService();
const textProcessingService = new MockTextProcessingService();
const textChunkingService = new MockTextChunkingService(embeddingService.getMaxTokens());

const embeddingsHandler: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const { text } = req.body;
        if (!text) {
            res.status(400).json({ error: 'Text input is required' });
            return;
        }

        // Process and chunk the text
        const processedText = textProcessingService.processText(text);
        const chunks = textChunkingService.chunkText(processedText);

        // Generate embeddings for each chunk
        const embeddings = await Promise.all(chunks.map(chunk => embeddingService.generateEmbedding(chunk)));

        // Send the embeddings as JSON response
        res.json({ embeddings });
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

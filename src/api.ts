import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { XenovaEmbeddingService } from './embedding.js';

const app = express();
app.use(bodyParser.json());

const embeddingService = new XenovaEmbeddingService();

const embeddingsHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const { text } = req.body;
        if (!text) {
            res.status(400).json({ error: 'Text input is required' });
            return;
        }

        const embeddings = await embeddingService.generateEmbeddingChunks(text);
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

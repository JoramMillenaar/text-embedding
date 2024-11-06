import express, { Request, Response, RequestHandler } from 'express';
import bodyParser from 'body-parser';
import { MockEmbeddingService } from '../tests/mocks';
import { MockTextProcessingService } from '../tests/mocks';
import { MockTextChunkingService } from '../tests/mocks';
import { TextEmbeddingController } from './controllers/TextEmbeddingController'


const app = express();
app.use(bodyParser.json());

const embeddingService = new MockEmbeddingService();
const textProcessingService = new MockTextProcessingService();
const textChunkingService = new MockTextChunkingService(embeddingService.getMaxTokens());

const textEmbeddingController = new TextEmbeddingController(textProcessingService, textChunkingService, embeddingService);

const embeddingsHandler: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const { text } = req.body;
        if (!text) {
            res.status(400).json({ error: 'Text input is required' });
            return;
        }

        const embeddings = await textEmbeddingController.getEmbeddings(text);
        res.json({ embeddings });
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate embeddings' });
    }
};


app.post('/embeddings', embeddingsHandler);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

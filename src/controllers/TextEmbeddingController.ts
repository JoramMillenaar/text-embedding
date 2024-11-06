import { ITextProcessingService } from '../services/TextProcessingService';
import { TextChunkingServiceBase } from '../services/TextChunkingService';
import { IEmbeddingService } from '../services/EmbeddingService';

export class TextEmbeddingController {
    constructor(
        private textProcessingService: ITextProcessingService,
        private textChunkingService: TextChunkingServiceBase,
        private embeddingService: IEmbeddingService
    ) { }

    async getEmbeddings(text: string): Promise<Float32Array[]> {
        const processedText = this.textProcessingService.processText(text);
        const chunks = this.textChunkingService.chunkText(processedText);
        return Promise.all(
            chunks.map(chunk => this.embeddingService.generateEmbedding(chunk))
        );
    }
}

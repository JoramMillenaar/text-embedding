import { ITextProcessingService } from '../src/services/TextProcessingService.js';
import { TextChunkingServiceBase } from '../src/services/TextChunkingService.js';
import { IEmbeddingService } from '../src/services/EmbeddingService.js';


export class MockEmbeddingService implements IEmbeddingService {
    async generateEmbedding(text: string): Promise<Float32Array> {
        return new Float32Array([0.1, 0.2, 0.3]); 
    }

    getMaxTokens(): number {
        return 200
    }
}


export class MockTextProcessingService implements ITextProcessingService {
    processText(text: string): string {
        return text.toLowerCase();
    }
}


export class MockTextChunkingService extends TextChunkingServiceBase {
    constructor(chunkSize: number) {
        super(chunkSize);
    }

    chunkText(text: string): string[] {
        const chunks: string[] = [];
        for (let i = 0; i < text.length; i += this.chunkSize) {
            chunks.push(text.substring(i, i + this.chunkSize));
        }
        return chunks;
    }
}

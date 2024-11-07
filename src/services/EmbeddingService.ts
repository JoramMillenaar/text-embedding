export interface IEmbeddingService {
    generateEmbedding(text: string): Promise<Float32Array>;
    getMaxTokens(): number;
}

export class XenovaEmbeddingService implements IEmbeddingService {
    private model: any = null;
    private initialized: Promise<void>;

    constructor() {
        this.initialized = this.initializeModel();
    }

    async ready(): Promise<void> {
        await this.initialized;
    }

    private async initializeModel(): Promise<void> {
        const { pipeline } = await import('@xenova/transformers');
        this.model = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    }
    
    async generateEmbedding(text: string): Promise<Float32Array> {
        await this.ready();
        const embedding = await this.model(text);
        return new Float32Array(embedding.data);
    }
    
    getMaxTokens(): number {
        return 256;
    }
}

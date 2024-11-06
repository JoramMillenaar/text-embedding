export interface IEmbeddingService {
    generateEmbedding(text: string): Promise<Float32Array>;
    getMaxTokens(): number;
}


export class XenovaEmbeddingService implements IEmbeddingService {
    private model: any = null;

    constructor() {
        this.initializeModel();
    }

    private async initializeModel(): Promise<void> {
        const { pipeline } = await import('@xenova/transformers');
        this.model = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    }
    async generateEmbedding(text: string): Promise<Float32Array> {
        if (!this.model) {
            throw new Error('Model not loaded yet. Please wait for initialization.');
        }
        const embedding = await this.model(text);
        return new Float32Array(embedding.data);
    }

    getMaxTokens(): number {
        return 256;
    }
}

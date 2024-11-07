
export class XenovaEmbeddingService {
    private model: any = null;
    private initialized: Promise<void>;
    private tokenizer: any = null;

    constructor() {
        this.initialized = this.initializeModel();
    }

    async ready(): Promise<void> {
        await this.initialized;
    }

    private async initializeModel(): Promise<void> {
        const { pipeline, AutoTokenizer } = await import('@xenova/transformers');
        this.model = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
        this.tokenizer = await AutoTokenizer.from_pretrained('Xenova/all-MiniLM-L6-v2');
    }

    async generateEmbedding(text: string): Promise<Float32Array> {
        await this.ready();
        const embedding = await this.model(text);
        return new Float32Array(embedding.data);
    }

    async generateEmbeddingChunks(text: string): Promise<{chunk: string, embedding: Float32Array}[]> {
        const chunks = await this.chunkText(text);
        return Promise.all(
            chunks.map(async (chunk) => {
                const embedding = await this.generateEmbedding(chunk);
                return { chunk, embedding };
            })
        );
    }

    getMaxTokens(): number {
        return 256;
    }

    async chunkText(text: string): Promise<string[]> {
        await this.ready();
        const chunks: string[] = [];
        let currentChunk: string[] = [];

        // Split text into sentences
        const sentences = text.match(/[^.!?]+[.!?]*/g) || [text]; // Fallback to treat whole text as one sentence if no match

        let tokenCount = 0;

        for (const sentence of sentences) {
            const sentenceTokenCount = await this.countTokens(sentence);

            // If adding the sentence would exceed the chunk size, finalize the current chunk
            if (tokenCount + sentenceTokenCount > this.getMaxTokens()) {
                if (currentChunk.length > 0) {
                    chunks.push(currentChunk.join(' '));
                    currentChunk = [];
                    tokenCount = 0;
                }
            }

            // Add sentence to current chunk
            currentChunk.push(sentence);
            tokenCount += sentenceTokenCount;
        }

        // Add any remaining text in the final chunk
        if (currentChunk.length > 0) {
            chunks.push(currentChunk.join(' '));
        }

        return chunks;
    }

    async countTokens(text: string): Promise<number> {
        return this.tokenizer.encode(text).length;
    }
}

export abstract class TextChunkingServiceBase {
    constructor(protected chunkSize: number) { }

    abstract chunkText(text: string): Promise<string[]>;
}

export class TokenBasedTextChunkingService extends TextChunkingServiceBase {
    constructor(chunkSize: number) {
        super(chunkSize);
    }

    async chunkText(text: string): Promise<string[]> {
        const chunks: string[] = [];
        let currentChunk: string[] = [];

        // Split text into sentences
        const sentences = text.match(/[^.!?]+[.!?]*/g) || [text]; // Fallback to treat whole text as one sentence if no match

        let tokenCount = 0;

        for (const sentence of sentences) {
            const sentenceTokenCount = await this.countTokens(sentence);

            // If adding the sentence would exceed the chunk size, finalize the current chunk
            if (tokenCount + sentenceTokenCount > this.chunkSize) {
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
        const { AutoTokenizer } = await import('@xenova/transformers');
        const tokenizer = await AutoTokenizer.from_pretrained('Xenova/all-MiniLM-L6-v2');
        return tokenizer.encode(text).length;
    }
}

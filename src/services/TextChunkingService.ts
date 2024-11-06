export abstract class TextChunkingServiceBase {
    constructor(protected chunkSize: number) {}

    abstract chunkText(text: string): string[];
}
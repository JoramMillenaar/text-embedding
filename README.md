# Text-to-Embedding

A TypeScript project that provides both REST API and WebSocket interfaces for generating text embeddings using the `@xenova/transformers` library. The project is structured to be usable as a standalone service or as a package that other projects can import directly to utilize embedding generation functionality.

## Features

- **REST API**: Exposes an endpoint for generating embeddings for a given text.
- **WebSocket Server**: Provides a WebSocket server for real-time embedding requests.
- **Direct Usage**: Allows direct interaction with the core embedding service for flexible integration in other projects.

## Installation

To use this project locally:

1. **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd your-project
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

3. **Build the project**:
    ```bash
    npm run build
    ```

## Usage

### Starting the REST API

The REST API runs on Express and listens on port 3000 by default. You can start it by running:

```bash
node dist/api/apiHandler.js
```

Once running, you can send POST requests to the `/embeddings` endpoint with a JSON body containing a `text` field:

#### Example Request

```bash
curl -X POST http://localhost:3000/embeddings -H "Content-Type: application/json" -d '{"text": "Your text here"}'
```

#### Example Response

```json
{
  "embeddings": [
    {
      "chunk": "Your text here",
      "embedding": [/* embedding array */]
    }
  ]
}
```

### Starting the WebSocket Server

To start the WebSocket server, run the following command. It listens on port 8080 by default:

```bash
node dist/ws/websocketHandler.js
```

Clients can connect to `ws://localhost:8080` and send text messages to receive embeddings.

#### WebSocket Message Example

**Client Message** (JSON string):
```json
"Your text here"
```

**Server Response** (JSON):
```json
{
  "embeddings": [
    {
      "chunk": "Your text here",
      "embedding": [/* embedding array */]
    }
  ]
}
```

### Using the Package in Other Projects

You can import this project as a package in other Node.js/TypeScript projects by adding it as a dependency.

#### Example

```typescript
import { XenovaEmbeddingService, apiHandler, startWebSocketServer } from 'text-to-embedding';

const service = new XenovaEmbeddingService();
service.ready().then(async () => {
    const embeddings = await service.generateEmbeddingChunks("Your text here");
    console.log(embeddings);
});

// Start WebSocket server on custom port 9090
startWebSocketServer(9090);

// Integrate `apiHandler` with your own Express app if needed
```


## Contributing

If you’d like to contribute:

1. Fork the repository.
2. Make your changes in a new branch.
3. Submit a pull request with a description of your changes.

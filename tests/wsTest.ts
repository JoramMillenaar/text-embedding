import { WebSocket } from 'ws';

const ws = new WebSocket('ws://localhost:8080');

// Listen for connection open
ws.on('open', () => {
    console.log('Connected to WebSocket server');

    // Send a text message to the server
    const text = "Your input text goes here.";
    ws.send(text);
});

// Listen for messages from the server
ws.on('message', (data: Buffer) => {
    const response = JSON.parse(data.toString());

    if (response.status === 'done') {
        console.log('All embeddings received');
    } else if (response.error) {
        console.error('Error:', response.error);
    } else {
        console.log('Received embedding:', response);
    }
});

// Listen for connection close
ws.on('close', () => {
    console.log('Disconnected from WebSocket server');
});

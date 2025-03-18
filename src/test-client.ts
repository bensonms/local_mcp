import WebSocket from 'ws';

const ws = new WebSocket('ws://localhost:3000');

// Initialize message ID counter
let messageId = 1;

ws.on('open', () => {
    console.log('Connected to MCP server');
    
    // Send initialize request
    const initializeRequest = {
        jsonrpc: '2.0',
        id: messageId++,
        method: 'initialize',
        params: {
            clientInfo: {
                name: 'Test Client',
                version: '1.0.0'
            }
        }
    };
    
    console.log('Sending initialize request:', JSON.stringify(initializeRequest, null, 2));
    ws.send(JSON.stringify(initializeRequest));
});

ws.on('message', (data) => {
    const message = JSON.parse(data.toString());
    console.log('=== Received message:', JSON.stringify(message, null, 2));
    
    // If we received a response to our initialize request
    if (message.id === 1) {
        // Send a text completion request
        const textRequest = {
            jsonrpc: '2.0',
            id: messageId++,
            method: 'text/complete',
            params: {
                prompt: 'What is the capital of France?',
                maxTokens: 100
            }
        };
        
        console.log('Sending text completion request:', JSON.stringify(textRequest, null, 2));
        ws.send(JSON.stringify(textRequest));
    }
});

ws.on('error', (error) => {
    console.error('WebSocket error:', error);
});

ws.on('close', () => {
    console.log('Connection closed');
}); 
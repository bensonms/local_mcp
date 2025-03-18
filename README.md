# MCP Server Implementation

## Description
The Model Context Protocol (MCP) Server is a robust implementation designed to bridge the gap between AI models and various data sources through a standardized communication protocol. This implementation provides a foundation for building scalable, interoperable AI applications that can seamlessly integrate with different models and tools.

Built on industry-standard WebSocket technology, this server facilitates real-time, bidirectional communication between clients and AI models. It implements the Model Context Protocol specification, ensuring compatibility with a wide range of AI tools and services while maintaining high performance and reliability.

Key aspects of this implementation include:
- Standardized JSON-RPC message format for consistent communication
- WebSocket-based transport layer for efficient real-time interactions
- Built-in support for various AI operations including text completion, chat, and embeddings
- Extensible architecture that allows for easy integration of new capabilities
- Comprehensive error handling and logging for production reliability

This implementation serves as both a reference implementation of the MCP protocol and a production-ready foundation for building AI-powered applications. It's particularly well-suited for:
- AI model integration projects
- Real-time AI applications
- Multi-model AI systems
- AI tool development and testing

## Features

### Core Server Capabilities
- **WebSocket-based Communication**
  - Real-time bidirectional communication
  - Efficient message streaming
  - Automatic reconnection handling
  - Connection state management

- **Protocol Implementation**
  - Full Model Context Protocol (MCP) compliance
  - JSON-RPC 2.0 message format
  - Structured request/response handling
  - Comprehensive error reporting

- **API Endpoints**
  - Health monitoring endpoint (`/health`)
  - Server capabilities endpoint (`/info`)
  - RESTful interface for server management
  - Standard HTTP status codes and error handling

- **Message Processing**
  - Asynchronous message handling
  - Request validation and sanitization
  - Response formatting and error handling
  - Message queuing and rate limiting

### AI Operations Support
- **Text Processing**
  - Text completion with configurable parameters
  - Tokenization and detokenization
  - Text embedding generation
  - Context-aware processing

- **Chat Functionality**
  - Multi-turn conversation support
  - Message history management
  - Role-based message handling
  - Context preservation

### Test Client Implementation
The test client provides a comprehensive testing and development environment for the MCP server:

- **Connection Management**
  - Automatic WebSocket connection establishment
  - Connection state monitoring
  - Graceful disconnection handling
  - Session management

- **Message Testing**
  - Predefined test scenarios
  - Custom message injection
  - Response validation
  - Error case simulation

- **Development Tools**
  - Real-time message logging
  - Request/response visualization
  - Performance monitoring
  - Debug information output

- **Testing Capabilities**
  - Protocol compliance verification
  - End-to-end testing scenarios
  - Load testing support
  - Error handling validation

## Installation
1. Clone this repository
2. Install dependencies:
```bash
npm install
```

## Usage
To run the development server:
```bash
npm run dev
```

To run the test client:
```bash
npm run test-client
```

To build the project:
```bash
npm run build
```

To run the production server:
```bash
npm start
```

## Examples

### Server Examples

1. Check server health:
```bash
curl http://localhost:3000/health
# Response: {"status":"ok"}
```

2. Get server information:
```bash
curl http://localhost:3000/info
# Response: {"capabilities":{"text":{},"chat":{}}}
```

### Test Client Examples

1. Basic text completion:
```typescript
// Example message sent to server
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "text/complete",
  "params": {
    "prompt": "What is the capital of France?",
    "maxTokens": 100
  }
}
```

2. Chat completion:
```typescript
// Example message sent to server
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "chat/complete",
  "params": {
    "messages": [
      {
        "role": "user",
        "content": "Tell me about artificial intelligence"
      }
    ]
  }
}
```

3. Text embedding:
```typescript
// Example message sent to server
{
  "jsonrpc": "2.0",
  "id": 3,
  "method": "text/embed",
  "params": {
    "text": "This is a sample text for embedding"
  }
}
```

4. Text tokenization:
```typescript
// Example message sent to server
{
  "jsonrpc": "2.0",
  "id": 4,
  "method": "text/tokenize",
  "params": {
    "text": "This is a sample text for tokenization"
  }
}
```

## API Endpoints
- `GET /health` - Health check endpoint
- `GET /info` - Server information endpoint

## WebSocket Message Types
- `initialize` - Initialize connection
- `chat` - Send chat messages
- `response` - Server responses
- `error` - Error messages

## Contributing
Feel free to submit issues and pull requests.

## License
MIT 
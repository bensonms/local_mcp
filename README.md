# MCP Server Implementation

## Description
A basic implementation of a Model Context Protocol (MCP) server that provides a standardized way to connect AI models to different data sources and tools.

## Features
- WebSocket-based communication
- Basic message handling
- Health check endpoint
- Server information endpoint
- Support for chat messages

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

To build the project:
```bash
npm run build
```

To run the production server:
```bash
npm start
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
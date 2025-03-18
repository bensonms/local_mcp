import express, { Request, Response } from 'express';
import { WebSocketServer, WebSocket } from 'ws';
import http from 'http';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { Implementation, JSONRPCMessage } from '@modelcontextprotocol/sdk/types.js';
import { Transport } from '@modelcontextprotocol/sdk/shared/transport.js';

// Add global error handlers
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});

class MCPServer {
    private app: express.Application;
    private server: http.Server;
    private wss: WebSocketServer;
    private mcpServer: McpServer;
    private port: number;
    private transport?: Transport;

    constructor(port: number = 3000) {
        this.port = port;
        this.app = express();
        this.server = http.createServer(this.app);
        this.wss = new WebSocketServer({ server: this.server });
        
        const serverInfo: Implementation = {
            name: 'Basic MCP Server',
            version: '1.0.0'
        };
        
        try {
            this.mcpServer = new McpServer(serverInfo, {
                capabilities: {
                    text: {},
                    chat: {}
                }
            });
            console.log('MCP Server initialized successfully');
        } catch (error) {
            console.error('Failed to initialize MCP Server:', error);
            throw error;
        }
        
        this.setupRoutes();
        this.setupWebSocket();
    }

    private setupRoutes(): void {
        // Basic health check endpoint
        this.app.get('/health', (req: Request, res: Response) => {
            res.json({ status: 'ok' });
        });

        // MCP server info endpoint
        this.app.get('/info', (req: Request, res: Response) => {
            try {
                const info = this.mcpServer.server.getClientCapabilities();
                res.json(info);
            } catch (error) {
                console.error('Error getting server info:', error);
                res.status(500).json({ error: 'Failed to get server info' });
            }
        });
    }

    private setupWebSocket(): void {
        this.wss.on('connection', async (ws: WebSocket) => {
            console.log('New client connected');

            try {
                // Create a transport for this WebSocket connection
                const transport: Transport = {
                    onmessage: undefined,
                    onclose: () => {
                        console.log('WebSocket connection closed');
                    },
                    onerror: (error: Error) => {
                        console.error('WebSocket error:', error);
                    },
                    send: async (message: JSONRPCMessage) => {
                        ws.send(JSON.stringify(message));
                    },
                    start: async () => {
                        // Nothing to do here since WebSocket is already started
                    },
                    close: async () => {
                        ws.close();
                    },
                    sessionId: crypto.randomUUID()
                };

                // Connect the MCP server to this transport
                await this.mcpServer.server.connect(transport);

                // Set up WebSocket event handlers
                ws.on('message', (data: Buffer) => {
                    try {
                        const message = JSON.parse(data.toString()) as JSONRPCMessage;
                        transport.onmessage?.(message);
                    } catch (error) {
                        console.error('Error parsing message:', error);
                    }
                });

                ws.on('close', () => {
                    transport.onclose?.();
                });

                ws.on('error', (error) => {
                    transport.onerror?.(error);
                });
            } catch (error) {
                console.error('Error setting up WebSocket connection:', error);
                ws.close();
            }
        });
    }

    public start(): void {
        this.server.listen(this.port, () => {
            console.log(`MCP Server running on port ${this.port}`);
        });
    }
}

// Start the server with error handling
try {
    const server = new MCPServer(3000);
    server.start();
} catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
} 
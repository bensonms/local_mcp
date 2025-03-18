import express, { Request, Response } from 'express';
import { WebSocketServer, WebSocket } from 'ws';
import http from 'http';
import { MCPServer as MCPSDKServer, MCPServerConfig, MCPMessage, MCPResponse } from '@modelcontextprotocol/sdk';

class MCPServer {
    private app: express.Application;
    private server: http.Server;
    private wss: WebSocketServer;
    private mcpServer: MCPSDKServer;
    private port: number;

    constructor(port: number = 3000) {
        this.port = port;
        this.app = express();
        this.server = http.createServer(this.app);
        this.wss = new WebSocketServer({ server: this.server });
        
        const config: MCPServerConfig = {
            name: 'Basic MCP Server',
            version: '1.0.0',
            capabilities: ['text', 'chat'],
            supportedProtocols: ['websocket'],
            maxContextLength: 4096,
            maxTokens: 2048
        };
        
        this.mcpServer = new MCPSDKServer(config);
        
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
            res.json(this.mcpServer.getServerInfo());
        });
    }

    private setupWebSocket(): void {
        this.wss.on('connection', (ws: WebSocket) => {
            console.log('New client connected');

            ws.on('message', async (message: string) => {
                try {
                    const mcpMessage: MCPMessage = JSON.parse(message);
                    const response = await this.handleMessage(mcpMessage);
                    ws.send(JSON.stringify(response));
                } catch (error) {
                    console.error('Error handling message:', error);
                    ws.send(JSON.stringify({
                        type: 'error',
                        payload: { message: 'Error processing request' }
                    }));
                }
            });

            ws.on('close', () => {
                console.log('Client disconnected');
            });
        });
    }

    private async handleMessage(message: MCPMessage): Promise<MCPResponse> {
        try {
            return await this.mcpServer.handleMessage(message);
        } catch (error) {
            console.error('Error in message handler:', error);
            return {
                type: 'error',
                payload: { message: 'Internal server error' }
            };
        }
    }

    public start(): void {
        this.server.listen(this.port, () => {
            console.log(`MCP Server running on port ${this.port}`);
        });
    }
}

// Start the server
const server = new MCPServer(3000);
server.start(); 
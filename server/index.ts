import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import { spawn, exec } from 'child_process';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { promisify } from 'util';

dotenv.config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// Middleware
app.use(cors());
app.use(express.json());

// Terminal WebSocket handler
wss.on('connection', (ws) => {
  console.log('New terminal connection');
  
  // Use PowerShell instead of bash
  const shell = spawn('powershell.exe', [], {
    shell: true,
    env: process.env
  });

  shell.stdout.on('data', (data) => {
    ws.send(data.toString());
  });

  shell.stderr.on('data', (data) => {
    ws.send(data.toString());
  });

  ws.on('message', (message) => {
    shell.stdin.write(message.toString() + '\n');
  });

  ws.on('close', () => {
    console.log('Terminal connection closed');
    shell.kill();
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Project import endpoint
app.post('/api/import', async (req, res) => {
  try {
    const { url } = req.body;
    const execAsync = promisify(exec);
    
    // Clone repository
    await execAsync(`git clone ${url} temp-project`);
    
    // Read files
    const { stdout } = await execAsync('find temp-project -type f -not -path "*/node_modules/*" -not -path "*/\.*"');
    const files = stdout.split('\n').filter(Boolean);
    
    const fileContents: Record<string, string> = {};
    for (const file of files) {
      const { stdout } = await execAsync(`cat "${file}"`);
      fileContents[file.replace('temp-project/', '')] = stdout;
    }
    
    // Cleanup
    await execAsync('rm -rf temp-project');
    
    res.json(fileContents);
  } catch (error) {
    res.status(500).json({ error: 'Failed to import project' });
  }
});

// Template endpoint
app.get('/api/templates/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const templatePath = `./templates/${id}`;
    
    const execAsync = promisify(exec);
    const { stdout } = await execAsync(`find ${templatePath} -type f`);
    const files = stdout.split('\n').filter(Boolean);
    
    const fileContents: Record<string, string> = {};
    for (const file of files) {
      const { stdout } = await execAsync(`cat "${file}"`);
      fileContents[file.replace(`${templatePath}/`, '')] = stdout;
    }
    
    res.json(fileContents);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load template' });
  }
});

// Deployment endpoints
app.get('/api/deployments/:platform/status', async (req, res) => {
  const { platform } = req.params;
  const apiKey = req.headers.authorization?.split(' ')[1];
  
  if (!apiKey) {
    return res.status(401).json({ error: 'No API key provided' });
  }
  
  try {
    // TODO: Implement actual platform API calls
    res.json({
      lastDeployed: new Date().toISOString(),
      url: `https://${platform}-deployment.example.com`,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch deployment status' });
  }
});

app.post('/api/deployments/:platform/deploy', async (req, res) => {
  const { platform } = req.params;
  const apiKey = req.headers.authorization?.split(' ')[1];
  
  if (!apiKey) {
    return res.status(401).json({ error: 'No API key provided' });
  }
  
  try {
    // TODO: Implement actual deployment
    res.json({
      url: `https://${platform}-deployment.example.com`,
    });
  } catch (error) {
    res.status(500).json({ error: 'Deployment failed' });
  }
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 
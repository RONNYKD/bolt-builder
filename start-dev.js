// Simple script to start Vite directly
const { createServer } = require('vite');

async function startServer() {
  try {
    console.log('Starting Vite development server...');
    
    const server = await createServer({
      // Configure as needed
      configFile: './vite.config.ts',
      server: {
        port: 3000,
        host: true, // Listen on all addresses
        open: true  // Open browser automatically
      }
    });
    
    await server.listen();
    
    const info = server.config.server;
    console.log(`Server running at: http://${info.host === true ? 'localhost' : info.host}:${info.port}`);
  } catch (e) {
    console.error('Error starting Vite server:', e);
    process.exit(1);
  }
}

startServer(); 
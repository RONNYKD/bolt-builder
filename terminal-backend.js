const WebSocket = require('ws');
const { spawn } = require('child_process');

const wss = new WebSocket.Server({ port: 3001 });

wss.on('connection', function connection(ws) {
  const shell = process.platform === 'win32' ? 'cmd.exe' : 'bash';
  const pty = spawn(shell, [], { stdio: ['pipe', 'pipe', 'pipe'] });

  pty.stdout.on('data', (data) => ws.send(data.toString()));
  pty.stderr.on('data', (data) => ws.send(data.toString()));

  ws.on('message', (msg) => {
    const str = msg.toString();
    if (/\b(rm|sudo|shutdown|reboot|:(){:|:&};:)\b/.test(str)) {
      ws.send('Blocked unsafe command.');
      return;
    }
    pty.stdin.write(str);
  });

  ws.on('close', () => {
    pty.kill();
  });
});

console.log('Terminal backend running on ws://localhost:3001'); 
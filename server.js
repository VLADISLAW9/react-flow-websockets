const express = require('express');
const http = require('node:http');
const path = require('node:path');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const clients = new Set();
let flowState = {
  nodes: [
    {
      id: '1',
      type: 'input',
      data: { label: 'Start' },
      position: { x: 250, y: 5 }
    },
    { id: '2', data: { label: 'Process' }, position: { x: 100, y: 100 } },
    { id: '3', data: { label: 'Process' }, position: { x: 400, y: 100 } },
    {
      id: '4',
      type: 'output',
      data: { label: 'End' },
      position: { x: 250, y: 200 }
    }
  ],
  edges: [
    { id: 'e1-2', source: '1', target: '2' },
    { id: 'e1-3', source: '1', target: '3' },
    { id: 'e2-4', source: '2', target: '4' },
    { id: 'e3-4', source: '3', target: '4' }
  ]
};

app.use(express.static(path.join(__dirname, '../client/build')));

wss.on('connection', (ws) => {
  console.log('New client connected');
  clients.add(ws);

  ws.send(
    JSON.stringify({
      type: 'INIT',
      payload: flowState
    })
  );

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);

      switch (data.type) {
        case 'UPDATE_FLOW':
          flowState = data.payload;

          clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
              client.send(
                JSON.stringify({
                  type: 'FLOW_UPDATED',
                  payload: flowState
                })
              );
            }
          });
          break;

        default:
          console.log('Unknown message type:', data.type);
      }
    } catch (error) {
      console.error('Error processing message:', error);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    clients.delete(ws);
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

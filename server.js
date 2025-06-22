import express from 'express';
import { Buffer } from 'node:buffer';
import http from 'node:http';
import { v4 as uuidv4 } from 'uuid';
import { WebSocketServer } from 'ws';

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const rooms = new Map();

const generateFunnyName = () => {
  const adjectives = ['Неопознанный', 'Таинственный', 'Огненный', 'Летающий', 'Скрытый', 'Быстрый'];
  const animals = ['медведь', 'лось', 'тигр', 'волк', 'лис', 'орёл', 'кот', 'пёс'];

  const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
  return `${randomAdj} ${randomAnimal}`;
};

const initialFlowState = {
  nodes: [
    {
      id: '1',
      type: 'node',
      data: { label: 'Start' },
      position: { x: 250, y: 5 }
    },
    {
      id: '2',
      type: 'node',
      data: { label: 'Process' },
      position: { x: 100, y: 100 }
    },
    {
      id: '3',
      type: 'node',
      data: { label: 'Process' },
      position: { x: 400, y: 100 }
    },
    {
      id: '4',
      type: 'node',
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

wss.on('connection', (ws) => {
  console.log('Новое подключение');

  let currentRoom = null;

  const currentUser = {
    id: uuidv4(),
    name: generateFunnyName(),
    color: `#${Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, '0')}`
  };

  const broadcastToRoom = (roomId, message, excludeWs = null) => {
    if (!rooms.has(roomId)) return;

    const room = rooms.get(roomId);
    const messageStr = JSON.stringify(message);

    for (const [client] of room.clients) {
      if (client !== excludeWs && client.readyState === 1) {
        client.send(messageStr);
      }
    }
  };

  const handleCursorMove = (ws, position) => {
    if (!currentRoom || !rooms.has(currentRoom)) return;

    const room = rooms.get(currentRoom);
    const user = room.clients.get(ws);

    if (!user) return;

    if (
      user.cursorPosition &&
      user.cursorPosition.x === position.x &&
      user.cursorPosition.y === position.y
    ) {
      return;
    }

    user.cursorPosition = position;

    broadcastToRoom(
      currentRoom,
      {
        type: 'CURSOR_MOVED',
        payload: {
          userId: user.id,
          position,
          color: user.color,
          name: user.name
        }
      },
      ws
    );
  };

  const handleAddNode = (ws, node) => {
    if (!currentRoom || !rooms.has(currentRoom)) return;

    const room = rooms.get(currentRoom);

    if (!node.id) node.id = `node-${uuidv4()}`;

    if (!room.flowState.nodes.some((n) => n.id === node.id)) {
      room.flowState.nodes.push(node);

      broadcastToRoom(
        currentRoom,
        {
          type: 'NODE_ADDED',
          payload: { node }
        },
        ws
      );
    }
  };

  const handleRemoveNode = (ws, nodeId) => {
    if (!currentRoom || !rooms.has(currentRoom)) return;

    const room = rooms.get(currentRoom);

    room.flowState.nodes = room.flowState.nodes.filter((n) => n.id !== nodeId);
    room.flowState.edges = room.flowState.edges.filter(
      (e) => e.source !== nodeId && e.target !== nodeId
    );

    broadcastToRoom(currentRoom, {
      type: 'NODE_REMOVED',
      payload: { nodeId }
    });
  };

  const handleUpdateNodeData = (ws, nodeId, newData) => {
    if (!currentRoom || !rooms.has(currentRoom)) return;

    const room = rooms.get(currentRoom);
    const node = room.flowState.nodes.find((n) => n.id === nodeId);

    if (!node) return;

    node.data = { ...node.data, ...newData };

    broadcastToRoom(currentRoom, {
      type: 'NODE_DATA_UPDATED',
      payload: { nodeId, newData }
    });
  };

  const handleMoveNode = (ws, nodeId, position) => {
    if (!currentRoom || !rooms.has(currentRoom)) return;

    const room = rooms.get(currentRoom);
    const node = room.flowState.nodes.find((n) => n.id === nodeId);

    if (!node) return;

    if (node.position.x === position.x && node.position.y === position.y) {
      return;
    }

    node.position = position;

    broadcastToRoom(
      currentRoom,
      {
        type: 'NODE_MOVED',
        payload: { nodeId, position }
      },
      ws
    );
  };

  const handleJoinRoom = (ws, roomId) => {
    if (!roomId) roomId = uuidv4();

    if (rooms.has(roomId)) {
      const room = rooms.get(roomId);
      Array.from(room.clients.entries()).forEach(([client, user]) => {
        if (client !== ws && user.cursorPosition) {
          ws.send(
            JSON.stringify({
              type: 'CURSOR_MOVED',
              payload: {
                userId: user.id,
                position: user.cursorPosition,
                color: user.color,
                name: user.name
              }
            })
          );
        }
      });
    }

    if (!rooms.has(roomId)) {
      rooms.set(roomId, {
        clients: new Map([[ws, currentUser]]),
        flowState: JSON.parse(JSON.stringify(initialFlowState))
      });

      console.log(`Создана новая комната: ${roomId}, пользователь: ${currentUser.name}`);

      ws.send(
        JSON.stringify({
          type: 'ROOM_JOINED',
          payload: {
            roomId,
            currentUser,
            flowState: rooms.get(roomId).flowState,
            users: [currentUser]
          }
        })
      );

      return;
    }

    const room = rooms.get(roomId);
    room.clients.set(ws, currentUser);
    currentRoom = roomId;

    console.log(`Пользователь ${currentUser.name} присоединился к комнате: ${roomId}`);

    ws.send(
      JSON.stringify({
        type: 'ROOM_JOINED',
        payload: {
          roomId,
          currentUser,
          flowState: room.flowState,
          users: Array.from(room.clients.values())
        }
      })
    );

    broadcastToRoom(
      roomId,
      {
        type: 'USER_JOINED',
        payload: { user: currentUser }
      },
      ws
    );
  };

  ws.on('message', (message) => {
    if (typeof message !== 'string' && !Buffer.isBuffer(message)) {
      console.warn('Получены неподдерживаемые данные:', message);
      return;
    }

    const text = message.toString();

    try {
      const data = JSON.parse(text);

      switch (data.type) {
        case 'JOIN_ROOM':
          handleJoinRoom(ws, data.payload.roomId);
          break;
        case 'ADD_NODE':
          handleAddNode(ws, data.payload.node);
          break;
        case 'REMOVE_NODE':
          handleRemoveNode(ws, data.payload.nodeId);
          break;
        case 'UPDATE_NODE_DATA':
          handleUpdateNodeData(ws, data.payload.nodeId, data.payload.newData);
          break;
        case 'MOVE_NODE':
          handleMoveNode(ws, data.payload.nodeId, data.payload.position);
          break;
        case 'MOVE_CURSOR':
          handleCursorMove(ws, data.payload.position);
          break;

        default:
          console.warn('Неизвестный тип сообщения:', data.type);
      }
    } catch (error) {
      console.error('Ошибка обработки JSON-сообщения:', error);
    }
  });

  ws.on('close', () => {
    if (currentRoom && rooms.has(currentRoom)) {
      const room = rooms.get(currentRoom);
      room.clients.delete(ws);

      broadcastToRoom(currentRoom, {
        type: 'USER_LEFT',
        payload: { userId: currentUser.id }
      });

      if (room.clients.size === 0) rooms.delete(currentRoom);
    }
  });
});

const PORT = 9000;
const HOST = '0.0.0.0';

server.listen(PORT, HOST, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});

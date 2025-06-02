import express from "express";
import http from "http";
import { WebSocketServer } from "ws";
import { v4 as uuidv4 } from "uuid";

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const rooms = new Map();

const initialFlowState = {
  nodes: [
    {
      id: "1",
      data: { label: "Start" },
      position: { x: 250, y: 5 },
    },
    { id: "2", data: { label: "Process" }, position: { x: 100, y: 100 } },
    { id: "3", data: { label: "Process" }, position: { x: 400, y: 100 } },
    {
      id: "4",
      data: { label: "End" },
      position: { x: 250, y: 200 },
    },
  ],
  edges: [
    { id: "e1-2", source: "1", target: "2" },
    { id: "e1-3", source: "1", target: "3" },
    { id: "e2-4", source: "2", target: "4" },
    { id: "e3-4", source: "3", target: "4" },
  ],
};

wss.on("connection", (ws) => {
  console.log("Новое подключение");
  let currentRoom = null;

  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message.toString());
      console.log("Получено сообщение:", data.type);

      switch (data.type) {
        case "JOIN_ROOM":
          handleJoinRoom(ws, data.payload.roomId);
          break;

        case "ADD_NODE":
          handleAddNode(ws, data.payload.node);
          break;

        case "REMOVE_NODE":
          handleRemoveNode(ws, data.payload.nodeId);
          break;

        case "UPDATE_NODE_DATA":
          handleUpdateNodeData(ws, data.payload.nodeId, data.payload.newData);
          break;

        case "MOVE_NODE":
          handleMoveNode(ws, data.payload.nodeId, data.payload.position);
          break;

        default:
          console.log("Неизвестный тип сообщения:", data.type);
      }
    } catch (error) {
      console.error("Ошибка обработки сообщения:", error);
    }
  });

  ws.on("close", () => {
    console.log("Клиент отключился");
    if (currentRoom && rooms.has(currentRoom)) {
      const room = rooms.get(currentRoom);
      room.clients.delete(ws);

      if (room.clients.size === 0) {
        rooms.delete(currentRoom);
        console.log(`Комната ${currentRoom} удалена`);
      }
    }
  });

  function handleJoinRoom(ws, roomId) {
    if (!roomId) {
      roomId = uuidv4();
    }

    if (!rooms.has(roomId)) {
      rooms.set(roomId, {
        clients: new Set([ws]),
        flowState: JSON.parse(JSON.stringify(initialFlowState)),
      });
      console.log(`Создана новая комната: ${roomId}`);
    } else {
      rooms.get(roomId).clients.add(ws);
      console.log(`Клиент присоединился к комнате: ${roomId}`);
    }

    currentRoom = roomId;

    ws.send(
      JSON.stringify({
        type: "ROOM_JOINED",
        payload: {
          roomId,
          flowState: rooms.get(roomId).flowState,
        },
      }),
    );
  }

  function handleAddNode(ws, node) {
    if (!currentRoom || !rooms.has(currentRoom)) return;

    const room = rooms.get(currentRoom);

    if (!node.id) {
      node.id = `node-${uuidv4()}`;
    }

    if (!room.flowState.nodes.some((n) => n.id === node.id)) {
      room.flowState.nodes.push(node);

      broadcastToRoom(
        currentRoom,
        {
          type: "NODE_ADDED",
          payload: { node },
        },
        ws,
      );
    }
  }

  function handleRemoveNode(ws, nodeId) {
    if (!currentRoom || !rooms.has(currentRoom)) return;

    const room = rooms.get(currentRoom);

    room.flowState.nodes = room.flowState.nodes.filter((n) => n.id !== nodeId);
    room.flowState.edges = room.flowState.edges.filter(
      (e) => e.source !== nodeId && e.target !== nodeId,
    );

    broadcastToRoom(currentRoom, {
      type: "NODE_REMOVED",
      payload: { nodeId },
    });
  }

  function handleUpdateNodeData(ws, nodeId, newData) {
    if (!currentRoom || !rooms.has(currentRoom)) return;

    const room = rooms.get(currentRoom);
    const node = room.flowState.nodes.find((n) => n.id === nodeId);

    if (node) {
      node.data = { ...node.data, ...newData };

      broadcastToRoom(currentRoom, {
        type: "NODE_DATA_UPDATED",
        payload: { nodeId, newData },
      });
    }
  }

  function handleMoveNode(ws, nodeId, position) {
    if (!currentRoom || !rooms.has(currentRoom)) return;

    const room = rooms.get(currentRoom);
    const node = room.flowState.nodes.find((n) => n.id === nodeId);

    if (node) {
      node.position = position;

      broadcastToRoom(
        currentRoom,
        {
          type: "NODE_MOVED",
          payload: { nodeId, position },
        },
        ws,
      );
    }
  }

  function broadcastToRoom(roomId, message, excludeWs = null) {
    if (!rooms.has(roomId)) return;

    const room = rooms.get(roomId);
    const messageStr = JSON.stringify(message);

    room.clients.forEach((client) => {
      if (client !== excludeWs && client.readyState === 1) {
        // 1 = OPEN
        client.send(messageStr);
      }
    });
  }
});

const PORT = process.env.PORT || 9000;
server.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});

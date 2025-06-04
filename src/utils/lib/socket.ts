import { useReactFlowStore, useRoomStore } from "../stores";
import type { User } from "../types";

export interface SocketMessage {
  payload: any;
  type:
    | "CURSOR_MOVED"
    | "NODE_ADDED"
    | "NODE_DATA_UPDATED"
    | "NODE_MOVED"
    | "NODE_REMOVED"
    | "ROOM_JOINED"
    | "USER_LEFT";
}

export const socket = new WebSocket("ws://localhost:9000");

export const initSocket = () => {
  console.log("[WebSocket] Connecting...");

  socket.onopen = () => {
    console.log("[WebSocket] Connected");

    socket.send(
      JSON.stringify({ type: "JOIN_ROOM", payload: { roomId: "1" } }),
    );
  };

  socket.onerror = (error) => {
    console.log(`[WebSocket] error ${error}`);
  };

  socket.onmessage = (event) => {
    const data: SocketMessage = JSON.parse(event.data);
    const { setNodes, setEdges, nodes, edges } = useReactFlowStore.getState();

    const { setRoomId, setUsers, users, cursors, setCursors } =
      useRoomStore.getState();

    console.log("[WebSocket] Message received:", data);

    if (data.type === "ROOM_JOINED") {
      const users = (data.payload.users as User[]).filter(
        (user) => user.id !== data.payload.currentUser.id,
      );

      setRoomId("1");
      setUsers(users);
      setNodes(data.payload.flowState.nodes);
      setEdges(data.payload.flowState.edges);
      setCursors(
        users.map((user: User) => ({
          userId: user.id,
          position: { x: 0, y: 0 },
          color: user.color,
          name: user.name,
          lastUpdated: Date.now(),
        })),
      );
      return;
    }

    if (data.type === "CURSOR_MOVED")
      return setCursors(
        cursors.map((cursor) =>
          cursor.userId === data.payload.userId ? data.payload : cursor,
        ),
      );

    if (data.type === "NODE_ADDED")
      return setNodes([...nodes, data.payload.node]);

    if (data.type === "NODE_REMOVED") {
      setNodes(nodes.filter((n) => n.id !== data.payload.nodeId));
      setEdges(
        edges.filter(
          (edge) =>
            edge.source !== data.payload.nodeId &&
            edge.target !== data.payload.nodeId,
        ),
      );
      return;
    }

    if (data.type === "NODE_DATA_UPDATED")
      return setNodes(
        nodes.map((node) =>
          node.id === data.payload.nodeId
            ? { ...node, data: { ...node.data, ...data.payload.newData } }
            : node,
        ),
      );

    if (data.type === "NODE_MOVED")
      return setNodes(
        nodes.map((node) =>
          node.id === data.payload.nodeId
            ? { ...node, position: data.payload.position }
            : node,
        ),
      );

    if (data.type === "USER_LEFT") {
      setUsers(users.filter((user) => user.id !== data.payload.userId));
      setCursors(
        cursors.filter((cursor) => cursor.userId !== data.payload.userId),
      );
      return;
    }
  };
};

export const socketActions = {
  addNode: (node: any) =>
    socket.send(JSON.stringify({ type: "ADD_NODE", payload: { node } })),

  removeNode: (nodeId: string) =>
    socket.send(JSON.stringify({ type: "REMOVE_NODE", payload: { nodeId } })),

  moveCursor: (position: { x: number; y: number }) =>
    socket.send(JSON.stringify({ type: "MOVE_CURSOR", payload: { position } })),

  joinRoom: (roomId: string) =>
    socket.send(JSON.stringify({ type: "JOIN_ROOM", payload: { roomId } })),

  moveNode: (nodeId: string, position: { x: number; y: number }) =>
    socket.send(
      JSON.stringify({ type: "MOVE_NODE", payload: { nodeId, position } }),
    ),

  updateNodeData: (nodeId: string, newData: any) =>
    socket.send(
      JSON.stringify({
        type: "UPDATE_NODE_DATA",
        payload: { nodeId, newData },
      }),
    ),
};

import { useReactFlowStore, useRoomStore } from "../stores";

export interface SocketMessage {
  payload: any;
  type:
    | "NODE_ADDED"
    | "NODE_DATA_UPDATED"
    | "NODE_MOVED"
    | "NODE_REMOVED"
    | "ROOM_JOINED"
    | "USER_LEFT";
}

const socket = new WebSocket("ws://localhost:9000");

export const initSocket = () => {
  console.log("[WebSocket] Connecting...");

  socket.onopen = () => {
    console.log("[WebSocket] Connected");
    socketActions.joinRoom("1");
  };

  socket.onmessage = (event) => {
    const data: SocketMessage = JSON.parse(event.data);
    const { setNodes, setEdges, nodes, edges } = useReactFlowStore.getState();
    const { setRoomId, setUsers, users } = useRoomStore.getState();

    console.log("[WebSocket] Message received:", data);

    if (data.type === "ROOM_JOINED") {
      setRoomId("1");
      setUsers(data.payload.clients);
      setNodes(data.payload.flowState.nodes);
      setEdges(data.payload.flowState.edges);
      return;
    }

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

    if (data.type === "USER_LEFT")
      setUsers(users.filter((user) => user !== data.payload.userId));
  };

  socket.onerror = (error) => {
    console.error("[WebSocket] Error:", error);
  };

  socket.onclose = (event) => {
    console.log(
      `[WebSocket] Closed with code ${event.code}, reason: ${event.reason}`,
    );
  };
};

export const socketActions = {
  addNode: (node: any) =>
    socket.send(JSON.stringify({ type: "ADD_NODE", payload: { node } })),

  removeNode: (nodeId: string) =>
    socket.send(JSON.stringify({ type: "REMOVE_NODE", payload: { nodeId } })),

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

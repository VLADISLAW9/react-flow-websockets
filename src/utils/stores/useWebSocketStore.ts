import { create } from "zustand";
import type { AppNode } from "../types/AppNode";
import { useReactFlowStore } from "./useReactFlowStore";

const WEB_SOCKET_URL = "http://localhost:9000";

type WebSocketStatus = "disconnected" | "connecting" | "connected" | "failed";

interface WebSocketState {
  ws: WebSocket | null;
  status: WebSocketStatus;
  roomId: string | number | undefined;
  users: string[];
  error: string | null;
}

interface WebSocketStoreAction {
  connect: () => void;
  disconnect: () => void;
  send: (data: any) => void;
  joinRoom: (roomId?: string | number) => void;
  addNode: (node: Omit<AppNode, "id">) => void;
  removeNode: (nodeId: string) => void;
  updateNodeData: (nodeId: string, newData: Partial<AppNode["data"]>) => void;
  moveNode: (nodeId: string, position: AppNode["position"]) => void;
  setRoomId: (roomId: string | number) => void;
  setUsers: (users: string[]) => void;
}

export const useWebSocketStore = create<WebSocketState & WebSocketStoreAction>(
  (set, get) => {
    const handleIncomingMessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);

      const { setNodes, setEdges, nodes, edges } = useReactFlowStore.getState();

      console.log("Message from server:", data);

      if (data.type === "ROOM_JOINED") {
        const { flowState } = data.payload;

        set({ roomId: 1 });
        setNodes(flowState.nodes);
        setEdges(flowState.edges);

        return;
      }

      if (data.type === "NODE_ADDED") {
        return setNodes([...nodes, data.payload.node]);
      }

      if (data.type === "NODE_REMOVED") {
        setNodes(nodes.filter((n) => n.id !== data.payload.nodeId));
        setEdges(
          edges.filter(
            (e) =>
              e.source !== data.payload.nodeId &&
              e.target !== data.payload.nodeId,
          ),
        );

        return;
      }

      if (data.type === "NODE_DATA_UPDATED") {
        return setNodes(
          nodes.map((n) =>
            n.id === data.payload.nodeId
              ? { ...n, data: { ...n.data, ...data.payload.newData } }
              : n,
          ),
        );
      }

      if (data.type === "NODE_MOVED") {
        return setNodes(
          nodes.map((n) =>
            n.id === data.payload.nodeId
              ? { ...n, position: data.payload.position }
              : n,
          ),
        );
      }

      if (data.type === "USER_LEFT") {
        return set((state) => ({
          users: state.users.filter((user) => user !== data.payload.userId),
        }));
      }
    };

    return {
      ws: null,
      status: "disconnected",
      roomId: 1,
      users: [],
      error: null,

      connect: () => {
        const { ws, status } = get();
        if (ws || status === "connecting") return;

        set({ status: "connecting", error: null });

        try {
          const socket = new WebSocket(WEB_SOCKET_URL);

          socket.onopen = () => {
            console.log("WebSocket connected");
            set({ ws: socket, status: "connected" });

            get().joinRoom(1);
          };

          socket.onmessage = handleIncomingMessage;

          socket.onclose = () => {
            console.log("WebSocket disconnected");
            set({ ws: null, status: "disconnected" });
          };

          socket.onerror = (error) => {
            console.error("WebSocket error:", error);
            set({
              status: "failed",
              error: "WebSocket connection failed",
            });
          };
        } catch (err) {
          set({
            status: "failed",
            error: err instanceof Error ? err.message : "Failed to connect",
          });
        }
      },

      disconnect: () => {
        const { ws } = get();
        if (ws) {
          ws.close();
          set({ ws: null, status: "disconnected" });
        }
      },

      send: (data) => {
        const { ws, status } = get();
        if (ws && status === "connected") {
          try {
            ws.send(JSON.stringify(data));
          } catch (err) {
            console.error("Failed to send message:", err);
            set({ error: "Failed to send message" });
          }
        }
      },

      joinRoom: (roomId) => {
        const { send, setRoomId } = get();
        const roomToJoin = roomId || get().roomId;

        if (!roomToJoin) return;

        send({
          type: "JOIN_ROOM",
          payload: { roomId: roomToJoin },
        });

        setRoomId(roomToJoin);
      },

      addNode: (node) => {
        const { send } = get();
        send({
          type: "ADD_NODE",
          payload: {
            node: {
              ...node,
              id: `node-${Date.now()}`,
            },
          },
        });
      },

      removeNode: (nodeId) => {
        const { send } = get();
        send({
          type: "REMOVE_NODE",
          payload: { nodeId },
        });
      },

      updateNodeData: (nodeId, newData) => {
        const { send } = get();
        send({
          type: "UPDATE_NODE_DATA",
          payload: { nodeId, newData },
        });
      },

      moveNode: (nodeId, position) => {
        const { send } = get();
        send({
          type: "MOVE_NODE",
          payload: { nodeId, position },
        });
      },

      setRoomId: (roomId) => set({ roomId }),

      setUsers: (users) => set({ users }),
    };
  },
);

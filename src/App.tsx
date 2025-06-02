import { type Edge } from "@xyflow/react";
import { ReactFlowComponent, ToolsBar } from "./components";
import { useWebSocket } from "@siberiacancode/reactuse";
import { useReactFlowStore, useRoomStore } from "./stores";

import type { AppNode } from "./types/AppNode";

const WEB_SOCKETS_URL = "http://localhost:9000/";

export const App = () => {
  const webSocket = useWebSocket(WEB_SOCKETS_URL, {
    onMessage: (event) => {
      const { setEdges, setNodes } = useReactFlowStore.getState();
      const { setRoomId } = useRoomStore.getState();

      const data = JSON.parse(event.data) as { type: string; payload: any };

      console.log("Ответ от сервера", data);

      if (data.type === "ROOM_JOINED") {
        const { flowState, roomId } = data.payload as {
          flowState: { nodes: AppNode[]; edges: Edge[] };
          roomId: string;
        };

        setRoomId(roomId);
        setNodes(flowState.nodes);
        setEdges(flowState.edges);
      }

      if (data.type === "NODE_ADDED") {
        const { nodes, setNodes } = useReactFlowStore.getState();

        const newNode = data.payload.node as AppNode;

        setNodes([...nodes, newNode]);
      }
    },
    onConnected: () => {
      webSocket.send(
        JSON.stringify({
          type: "JOIN_ROOM",
          payload: { roomId: 1 },
        }),
      );
    },
  });

  if (webSocket.status === "connecting") return <h1>ПОДКЛЮЧЕНИЕ...</h1>;

  if (webSocket.status === "failed") return <h1>ОШИБКА ПРИ ПОДКЛЮЧЕНИИ</h1>;

  return (
    <div className="flex h-screen">
      <ToolsBar webSocketSend={webSocket.send} />
      <ReactFlowComponent />
    </div>
  );
};

import { useEffect } from "react";

import { ReactFlowComponent, ToolsBar } from "./components";
import { initSocket, socket } from "./utils/lib";

export const App = () => {
  useEffect(() => {
    initSocket();

    return () => {
      if (socket.readyState === WebSocket.OPEN) socket.close();
    };
  }, []);

  return (
    <div className="flex h-screen">
      <ToolsBar />

      <ReactFlowComponent />
    </div>
  );
};

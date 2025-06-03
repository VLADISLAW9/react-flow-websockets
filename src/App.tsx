import { useEffect } from "react";
import { ReactFlowComponent, ToolsBar } from "./components";

import { useWebSocketStore } from "./utils/stores";

export const App = () => {
  const { connect, disconnect, status } = useWebSocketStore();

  useEffect(() => {
    connect();
    return () => disconnect();
  }, []);

  if (status === "connecting") return <h1>Connecting...</h1>;
  if (status === "failed") return <h1>Failed</h1>;

  return (
    <div className="flex h-screen">
      <ToolsBar />
      <ReactFlowComponent />
    </div>
  );
};

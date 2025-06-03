import { useEffect } from "react";
import { ReactFlowComponent, ToolsBar } from "./components";

import { useWebSocketStore, type UseWebSocketStore } from "./utils/stores";
import { useShallow } from "zustand/shallow";

const WEB_SOCKET_STORE_SELECTOR = (state: UseWebSocketStore) => ({
  connect: state.connect,
  disconnect: state.disconnect,
  status: state.status,
});

export const App = () => {
  const { connect, disconnect, status } = useWebSocketStore(
    useShallow(WEB_SOCKET_STORE_SELECTOR),
  );

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

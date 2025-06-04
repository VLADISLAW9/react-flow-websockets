import { useEffect } from "react";

import { ReactFlowComponent, ToolsBar } from "./components";
import { initSocket } from "./utils/lib/socket";

export const App = () => {
  useEffect(() => {
    initSocket();
  }, []);

  return (
    <div className="flex h-screen">
      <ToolsBar />
      <ReactFlowComponent />
    </div>
  );
};

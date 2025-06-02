import { ReactFlowProvider } from "@xyflow/react";

import { ReactFlowComponent, ToolsBar } from "./components";

export const App = () => {
  return (
    <ReactFlowProvider>
      <div className="flex h-screen">
        <ToolsBar />
        <ReactFlowComponent />
      </div>
    </ReactFlowProvider>
  );
};

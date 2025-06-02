import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { App } from "./App.tsx";

import "./index.css";
import { ReactFlowProvider } from "@xyflow/react";

const init = () => {
  const root = createRoot(document.getElementById("root")!);

  root.render(
    <StrictMode>
      <ReactFlowProvider>
        <App />
      </ReactFlowProvider>
    </StrictMode>,
  );
};

init();

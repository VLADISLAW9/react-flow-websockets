import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { App } from "./App.tsx";

import "./index.css";

const init = () => {
  const root = createRoot(document.getElementById("root")!);

  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
};

init();

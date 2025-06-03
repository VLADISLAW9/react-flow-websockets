import { Background, Controls, MiniMap, ReactFlow } from "@xyflow/react";
import { useShallow } from "zustand/shallow";

import type { UseReactFlowStore } from "@/utils/stores";

import { useReactFlowStore } from "@/utils/stores";

import "@xyflow/react/dist/style.css";

const selector = (state: UseReactFlowStore) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  setNodes: state.setNodes,
});

export const ReactFlowComponent = () => {
  const { edges, nodes, onConnect, onEdgesChange, onNodesChange } =
    useReactFlowStore(useShallow(selector));

  return (
    <ReactFlow
      edges={edges}
      nodes={nodes}
      onConnect={onConnect}
      onEdgesChange={onEdgesChange}
      onNodesChange={onNodesChange}
    >
      <Background />
      <Controls />
      <MiniMap pannable zoomable />
    </ReactFlow>
  );
};

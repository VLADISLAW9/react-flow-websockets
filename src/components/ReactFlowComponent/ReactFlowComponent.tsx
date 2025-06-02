import type { Node } from "@xyflow/react";

import { state } from "@formkit/drag-and-drop";
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  useReactFlow,
} from "@xyflow/react";
import { useShallow } from "zustand/shallow";

import type { UseReactFlowStore } from "@/stores";

import { useReactFlowStore } from "@/stores";

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
  const { screenToFlowPosition } = useReactFlow();

  const { edges, nodes, setNodes, onConnect, onEdgesChange, onNodesChange } =
    useReactFlowStore(useShallow(selector));

  state.on("dragEnded", ({ coordinates }: any) => {
    const newNode: Node = {
      id: Date.now().toString(),
      position: screenToFlowPosition(coordinates),
      data: { title: "Block" },
    };

    setNodes([...nodes, newNode]);
  });

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

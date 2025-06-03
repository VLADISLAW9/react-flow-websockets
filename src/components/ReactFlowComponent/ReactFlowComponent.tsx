import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  type OnNodeDrag,
  type OnNodesDelete,
} from "@xyflow/react";
import { useShallow } from "zustand/shallow";

import type { UseReactFlowStore, UseWebSocketStore } from "@/utils/stores";

import { useReactFlowStore, useWebSocketStore } from "@/utils/stores";

import "@xyflow/react/dist/style.css";
import { Node } from "./components";
import type { AppNode } from "@/utils/types/AppNode";

const REACT_FLOW_STOR_SELECTOR = (state: UseReactFlowStore) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  setNodes: state.setNodes,
});

const WEB_SOCKETS_STORE_SELECTOR = (state: UseWebSocketStore) => ({
  moveNode: state.moveNode,
});

const NODE_TYPES = {
  node: Node,
};

export const ReactFlowComponent = () => {
  const { moveNode } = useWebSocketStore(
    useShallow(WEB_SOCKETS_STORE_SELECTOR),
  );

  const { edges, nodes, onConnect, onEdgesChange, onNodesChange } =
    useReactFlowStore(useShallow(REACT_FLOW_STOR_SELECTOR));

  const onNodeDrag: OnNodeDrag<AppNode> = (_, node) =>
    moveNode(node.id, node.position);

  const onNodesDelete: OnNodesDelete<AppNode> = (nodes) => {};

  return (
    <ReactFlow
      edges={edges}
      nodes={nodes}
      nodeTypes={NODE_TYPES}
      onConnect={onConnect}
      onNodesDelete={onNodesDelete}
      onNodeDrag={onNodeDrag}
      onEdgesChange={onEdgesChange}
      onNodesChange={onNodesChange}
    >
      <Background />
      <Controls />
      <MiniMap pannable zoomable />
    </ReactFlow>
  );
};

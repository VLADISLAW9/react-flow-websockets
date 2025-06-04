import { Background, Controls, MiniMap, ReactFlow } from '@xyflow/react';
import { useShallow } from 'zustand/shallow';

import type { UseReactFlowStore } from '@/utils/stores';

import { useReactFlowStore } from '@/utils/stores';

import { Node } from './components';

import '@xyflow/react/dist/style.css';

const REACT_FLOW_STOR_SELECTOR = (state: UseReactFlowStore) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  setNodes: state.setNodes
});

const NODE_TYPES = {
  node: Node
};

export const ReactFlowComponent = () => {
  const { edges, nodes, onConnect, onEdgesChange, onNodesChange } = useReactFlowStore(
    useShallow(REACT_FLOW_STOR_SELECTOR)
  );

  // const onNodeDrag: OnNodeDrag<AppNode> = (_, node) => moveNode(node.id, node.position);

  // const onNodesDelete: OnNodesDelete<AppNode> = (nodes) => {};

  return (
    <ReactFlow
      edges={edges}
      nodes={nodes}
      nodeTypes={NODE_TYPES}
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

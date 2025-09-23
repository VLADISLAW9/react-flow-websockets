import { useReactFlowStore } from '@/utils/stores';
import type { AppNode } from '@/utils/types';
import { y } from '../yjs/instance';
import type { Edge } from '@xyflow/react';
import { socketActions } from '../socket';

export class ReactFlow {
  setNodes(nodes: AppNode[]) {
    y.setNodes(nodes);

    console.log(y.getNodes());

    useReactFlowStore.getState().setNodes(y.getNodes());
  }

  setEdges(edges: Edge[]) {
    y.setEdges(edges);
    useReactFlowStore.getState().setEdges(y.getEdges());
  }

  moveCursor(position: { x: number; y: number }) {
    socketActions.moveCursor(position);
  }

  moveNode(node: AppNode) {
    socketActions.moveNode(node.id, node.position);
  }

  setNode(updatedNode: AppNode) {
    const nodes = useReactFlowStore.getState().nodes;
    const updatedNodeIndex = nodes.findIndex((node) => node.id === updatedNode.id);

    if (updatedNodeIndex === -1) return;

    const updatedNodes = [...nodes];
    updatedNodes[updatedNodeIndex] = updatedNode;

    y.setNodes(nodes);
    useReactFlowStore.getState().setNodes(y.getNodes());
  }

  addNode(node: AppNode) {
    const currentNodes = useReactFlowStore.getState().nodes;
    const newNodes = [...currentNodes, node];

    y.setNodes(newNodes);
    useReactFlowStore.getState().setNodes(y.getNodes());
  }

  removeNode(nodeId: string) {
    const currentNodes = useReactFlowStore.getState().nodes;
    const newNodes = currentNodes.filter((node) => node.id !== nodeId);

    y.setNodes(newNodes);
    useReactFlowStore.getState().setNodes(y.getNodes());
  }
}

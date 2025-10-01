import type { Edge } from '@xyflow/react';

import type { AppNode } from '@/utils/types';

import { useReactFlowStore } from '@/utils/stores';

import { socketActions } from '../socket';
import { y } from '../yjs/instance';

export class Canvas {
  public getNodes() {
    return useReactFlowStore.getState().nodes;
  }

  public getEdges() {
    return useReactFlowStore.getState().edges;
  }

  public setNodes(nodes: AppNode[]) {
    y.setNodes(nodes);
    useReactFlowStore.getState().setNodes(y.getNodes());
  }

  public setEdges(edges: Edge[]) {
    useReactFlowStore.getState().setEdges(edges);
  }

  public moveCursor(position: { x: number; y: number }) {
    socketActions.moveCursor(position);
  }

  public applyNodesUpdate(update: Record<number, number>) {
    y.applyNodesUpdate(new Uint8Array(Object.values(update)));
    useReactFlowStore.getState().setNodes(y.getNodes());
  }

  public moveNode(node: AppNode) {
    socketActions.moveNode(node.id, node.position);
  }

  public setNode(updatedNode: AppNode) {
    const nodes = useReactFlowStore.getState().nodes;
    const updatedNodeIndex = nodes.findIndex((node) => node.id === updatedNode.id);

    if (updatedNodeIndex === -1) return;

    const updatedNodes = [...nodes];
    updatedNodes[updatedNodeIndex] = updatedNode;

    y.setNode(updatedNode);
    useReactFlowStore.getState().setNodes(updatedNodes);

    socketActions.updateNodeData(updatedNode.id, new Uint8Array(y.getNodesUpdate()));
  }

  public addNode(node: AppNode) {
    const currentNodes = useReactFlowStore.getState().nodes;
    const newNodes = [...currentNodes, node];

    y.addNode(node);
    useReactFlowStore.getState().setNodes(newNodes);

    socketActions.addNode(node);
  }

  public removeNode(nodeId: string) {
    const nodes = useReactFlowStore.getState().nodes;

    y.removeNode(nodeId);
    useReactFlowStore.getState().setNodes(nodes.filter((node) => node.id !== nodeId));

    socketActions.removeNode(nodeId);
  }
}

import type { Edge } from '@xyflow/react';

import type { AppNode } from '@/utils/types';

import { useReactFlowStore } from '@/utils/stores';

import { socketActions } from '../socket';
import { yjs } from '../yjs/instance';

export class Canvas {
  public getNodes() {
    return useReactFlowStore.getState().nodes;
  }

  public getEdges() {
    return useReactFlowStore.getState().edges;
  }

  public setNodes(nodes: AppNode[]) {
    yjs.setNodeValues(nodes);
    useReactFlowStore.getState().setNodes(yjs.getNodeValues() as any);
  }

  public setEdges(edges: Edge[]) {
    yjs.setEdgeValues(edges);
    useReactFlowStore.getState().setEdges(yjs.getEdgeValues() as any);
  }

  public moveCursor(position: { x: number; y: number }) {
    socketActions.moveCursor(position);
  }

  public applyNodesUpdate(update: number[]) {
    yjs.applyNodesUpdate(new Uint8Array(Array.from(update)));
    useReactFlowStore.getState().setNodes(yjs.getNodeValues() as any);
  }

  public applyEdgesUpdate(update: number[]) {
    yjs.applyEdgesUpdate(new Uint8Array(Array.from(update)));
    useReactFlowStore.getState().setNodes(yjs.getEdgeValues() as any);
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

    yjs.setNodeValue(updatedNode);
    useReactFlowStore.getState().setNodes(updatedNodes);

    const update = new Uint8Array(yjs.getNodesUpdate());

    socketActions.updateNodeData(updatedNode.id, update);
  }

  public addNode(node: AppNode) {
    const currentNodes = useReactFlowStore.getState().nodes;
    const newNodes = [...currentNodes, node];

    yjs.setNodeValue(node);
    useReactFlowStore.getState().setNodes(newNodes);

    socketActions.addNode(node);
  }

  public removeNode(nodeId: string) {
    const nodes = useReactFlowStore.getState().nodes;

    yjs.removeNodeValue(nodeId);
    useReactFlowStore.getState().setNodes(nodes.filter((node) => node.id !== nodeId));

    socketActions.removeNode(nodeId);
  }
}

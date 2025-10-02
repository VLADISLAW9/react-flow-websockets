import type { Edge } from '@xyflow/react';

import type { AppNode } from '@/utils/types';

import { useReactFlowStore } from '@/utils/stores';

import { socketActions } from '../socket';
import { y } from '../yjs/instance';

export class Canvas {
  public getNodes() {
    return useReactFlowStore.getState().nodes;
  }

  public getNode(nodeId: string) {
    return useReactFlowStore.getState().nodes.find((node) => node.id === nodeId);
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

  public applyNodeUpdate(nodeId: string, update: Record<number, number>) {
    y.applyNodeUpdate(nodeId, new Uint8Array(Object.values(update)));
    useReactFlowStore.getState().setNode(y.getNode(nodeId));
  }

  public moveNode(node: AppNode) {
    socketActions.moveNode(node.id, node.position);
  }

  public setNode(updatedNode: AppNode, sendSocketMessage = true) {
    y.setNode(updatedNode);
    useReactFlowStore.getState().setNode(y.getNode(updatedNode.id));

    if (sendSocketMessage)
      return socketActions.updateNodeData(
        updatedNode.id,
        new Uint8Array(y.getNodeUpdate(updatedNode.id))
      );
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

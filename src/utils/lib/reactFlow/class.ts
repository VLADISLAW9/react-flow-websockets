import { useReactFlowStore } from '@/utils/stores';
import type { AppNode } from '@/utils/types';

import type { Edge } from '@xyflow/react';
import { socketActions } from '../socket';
import * as Y from 'yjs';

const NODES_KEY = 'NODES_KEY';
const EDGES_KEY = 'EDGES_KEY';

export class ReactFlow {
  private _y = new Y.Doc();

  private _getNodesMap() {
    return this._y.getMap().get(NODES_KEY) as AppNode[];
  }

  private _getEdgesMap() {
    return this._y.getMap().get(EDGES_KEY) as Edge[];
  }

  private _getUpdate() {
    return Y.encodeStateAsUpdate(this._y);
  }

  private _setNodesMap(nodes: AppNode[]) {
    this._y.getMap().set(NODES_KEY, nodes);
  }

  private _setEdgesMap(edges: Edge[]) {
    this._y.getMap().set(EDGES_KEY, edges);
  }

  public applyUpdate(update: Uint8Array) {
    Y.applyUpdate(this._y, update);
    useReactFlowStore.getState().setNodes(this._getNodesMap());
  }

  public setNodes(nodes: AppNode[]) {
    this._setNodesMap(nodes);
    useReactFlowStore.getState().setNodes(this._getNodesMap());
  }

  public setEdges(edges: Edge[]) {
    this._setEdgesMap(edges);
    useReactFlowStore.getState().setEdges(this._getEdgesMap());
  }

  public moveCursor(position: { x: number; y: number }) {
    socketActions.moveCursor(position);
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

    this._setNodesMap(updatedNodes);
    useReactFlowStore.getState().setNodes(updatedNodes);

    socketActions.updateNodeData(updatedNode.id, this._getUpdate());
  }

  public addNode(node: AppNode) {
    const currentNodes = useReactFlowStore.getState().nodes;
    const newNodes = [...currentNodes, node];

    this._setNodesMap(newNodes);
    useReactFlowStore.getState().setNodes(newNodes);

    socketActions.addNode(node);
  }

  public removeNode(nodeId: string) {
    const currentNodes = useReactFlowStore.getState().nodes;
    const newNodes = currentNodes.filter((node) => node.id !== nodeId);

    this._setNodesMap(newNodes);
    useReactFlowStore.getState().setNodes(newNodes);

    socketActions.removeNode(nodeId);
  }
}

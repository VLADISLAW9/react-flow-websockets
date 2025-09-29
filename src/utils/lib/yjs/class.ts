import type { Edge } from '@xyflow/react';

import * as Y from 'yjs';

import type { AppNode } from '@/utils/types';

export class Yjs {
  private _nodesDoc = new Y.Doc();
  private _edgedDoc = new Y.Doc();

  public nodesDoc() {
    return this._nodesDoc;
  }

  public getNodeValues() {
    return Array.from(this._nodesDoc.getMap<AppNode>().values());
  }

  public getEdgeValues() {
    return Array.from(this._edgedDoc.getMap<Edge>().values());
  }

  public getNodesUpdate() {
    return Y.encodeStateAsUpdate(this._nodesDoc);
  }

  public setNodeValue(node: AppNode) {
    this._nodesDoc.getMap().set(node.id, node);
  }

  public removeNodeValue(nodeId: AppNode['id']) {
    this._nodesDoc.getMap().delete(nodeId);
  }

  public setEdgeValue(edge: Edge) {
    this._edgedDoc.getMap().set(edge.id, edge);
  }

  public setNodeValues(nodes: AppNode[]) {
    nodes.forEach((node) => this._nodesDoc.getMap().set(node.id, node));
  }

  public setEdgeValues(edges: Edge[]) {
    edges.forEach((edge) => this._edgedDoc.getMap().set(edge.id, edge));
  }

  public applyNodesUpdate(update: Uint8Array) {
    Y.applyUpdate(this._nodesDoc, update);
  }

  public applyEdgesUpdate(update: Uint8Array) {
    Y.applyUpdate(this._edgedDoc, update);
  }
}

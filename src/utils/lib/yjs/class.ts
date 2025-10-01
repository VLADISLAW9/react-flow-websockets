import * as _Y from 'yjs';

import type { AppNode } from '@/utils/types';

export class Y {
  private _nodesDoc = new _Y.Doc();
  private _nodesMap = this._nodesDoc.getMap<AppNode>();

  public getNodes() {
    return Array.from(this._nodesMap.values());
  }

  public setNodes(nodes: AppNode[]) {
    nodes.forEach((node) => this._nodesMap.set(node.id, node));
  }

  public getNodesUpdate() {
    return _Y.encodeStateAsUpdate(this._nodesDoc);
  }

  public applyNodesUpdate(remoteUpdate: Uint8Array) {
    const localUpdate = this.getNodesUpdate();
    const mergedUpdates = _Y.mergeUpdates([localUpdate, remoteUpdate]);

    _Y.applyUpdate(this._nodesDoc, mergedUpdates);
  }

  public setNode(node: AppNode) {
    const currentNode = this._nodesMap.get(node.id);

    if (!currentNode) return;

    this._nodesMap.set(node.id, node);
  }

  public removeNode(nodeId: string) {
    this._nodesMap.delete(nodeId);
  }

  public addNode(node: AppNode) {
    this._nodesMap.set(node.id, node);
  }
}

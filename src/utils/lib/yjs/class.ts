import type { AppNode } from '@/utils/types';
import * as _Y from 'yjs';

export class Y {
  private _doc = new _Y.Doc();
  private _nodes = this._doc.getArray<any>('nodes');

  public setNodes(nodes: AppNode[]) {
    nodes.forEach((node) => {
      const nodeDoc = new _Y.Doc();
      const nodeMap = nodeDoc.getMap<any>();

      Object.entries(node.data).forEach(([key, value]) => {
        nodeMap.set(key, value);
      });

      this._nodes.push([
        { id: node.id, yDoc: nodeDoc, yMap: nodeMap, position: node.position, type: node.type }
      ]);
    });
  }

  public getNodes() {
    return this._nodes.toArray().map((node) => {
      const nodeData = node.yMap.toJSON();

      return {
        id: node.id,
        data: nodeData,
        position: node.position,
        type: node.type
      } as AppNode;
    });
  }

  public removeNode(nodeId: string) {
    const nodeIndex = this._nodes.toArray().findIndex((node) => node.id === nodeId);

    if (nodeIndex === -1) return;

    this._nodes.delete(nodeIndex);
  }

  public addNode(node: AppNode) {
    const nodeDoc = new _Y.Doc();
    const nodeMap = nodeDoc.getMap<any>();

    Object.entries(node.data).forEach(([key, value]) => {
      nodeMap.set(key, value);
    });

    this._nodes.push([
      { id: node.id, yDoc: nodeDoc, yMap: nodeMap, position: node.position, type: node.type }
    ]);
  }

  public getNodeDoc(nodeId: string) {
    const node = this._nodes.toArray().find((node) => node.id === nodeId);
    return node.yDoc as _Y.Doc;
  }

  public getNodeMap(nodeId: string) {
    const node = this._nodes.toArray().find((node) => node.id === nodeId);
    return node.yDoc.getMap() as _Y.Map<any>;
  }

  public getNode(nodeId: string) {
    const node = this._nodes.toArray().find((node) => node.id === nodeId);
    const nodeData = node.yMap.toJSON();

    return {
      id: node.id,
      data: nodeData,
      position: node.position,
      type: node.type
    } as AppNode;
  }

  public getNodeUpdate(nodeId: string) {
    return _Y.encodeStateAsUpdate(this.getNodeDoc(nodeId));
  }

  public applyNodeUpdate(nodeId: string, update: Uint8Array) {
    const nodeDoc = this.getNodeDoc(nodeId);

    const localNodeUpdate = _Y.encodeStateAsUpdate(nodeDoc);
    const mergedUpdates = _Y.mergeUpdates([localNodeUpdate, update]);

    _Y.applyUpdate(nodeDoc, mergedUpdates);
  }

  public setNode(node: AppNode) {
    const nodeMap = this.getNodeMap(node.id);

    Object.entries(node.data).forEach(([key, value]) => {
      nodeMap.set(key, value);
    });

    this._nodes.push([
      {
        id: node.id,
        yDoc: this.getNodeDoc(node.id),
        yMap: nodeMap,
        position: node.position,
        type: node.type
      }
    ]);
  }
}

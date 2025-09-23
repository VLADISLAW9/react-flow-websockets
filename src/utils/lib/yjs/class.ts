import type { AppNode } from '@/utils/types';
import type { Edge } from '@xyflow/react';
import * as _Y from 'yjs';

const NODES_KEY = 'NODES_KEY';
const EDGES_KEY = 'EDGES_KEY';

export class Y {
  private Doc = new _Y.Doc();

  getNodes() {
    return this.Doc.getMap().get(NODES_KEY) as AppNode[];
  }

  getEdges() {
    return this.Doc.getMap().get(EDGES_KEY) as Edge[];
  }

  setNodes(value: AppNode[]) {
    this.Doc.getMap().set(NODES_KEY, value);
  }

  setEdges(value: Edge[]) {
    this.Doc.getMap().set(EDGES_KEY, value);
  }
}

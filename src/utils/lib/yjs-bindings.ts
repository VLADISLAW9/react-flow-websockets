import type { Edge } from '@xyflow/react';
import type * as Y from 'yjs';

import type { AppNode } from '@/utils/types/AppNode';

export const bindReactFlow = (
  doc: Y.Doc,
  onNodesUpdate: (nodes: AppNode[]) => void,
  onEdgesUpdate: (edges: Edge[]) => void
) => {
  const yNodes = doc.getArray<AppNode>('nodes');
  const yEdges = doc.getArray<Edge>('edges');

  const nodesObserver = () => onNodesUpdate(yNodes.toArray());
  const edgesObserver = () => onEdgesUpdate(yEdges.toArray());

  yNodes.observeDeep(nodesObserver);
  yEdges.observeDeep(edgesObserver);

  onNodesUpdate(yNodes.toArray());
  onEdgesUpdate(yEdges.toArray());

  return () => {
    yNodes.unobserveDeep(nodesObserver);
    yEdges.unobserveDeep(edgesObserver);
  };
};

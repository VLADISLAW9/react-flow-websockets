import { useReactFlowStore } from '@/utils/stores';
import { reactFlow } from '../../reactFlow/instance';

export const handleNodeRemoved = (data: any) => {
  const { edges, nodes } = useReactFlowStore.getState();

  reactFlow.setNodes(nodes.filter((n) => n.id !== data.payload.nodeId));
  reactFlow.setEdges(
    edges.filter(
      (edge) => edge.source !== data.payload.nodeId && edge.target !== data.payload.nodeId
    )
  );
};

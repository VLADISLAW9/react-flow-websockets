import { useReactFlowStore } from '@/utils/stores';

export const handleNodeRemoved = (data: any) => {
  const { setNodes, edges, nodes, setEdges } = useReactFlowStore.getState();

  setNodes(nodes.filter((n) => n.id !== data.payload.nodeId));
  setEdges(
    edges.filter(
      (edge) => edge.source !== data.payload.nodeId && edge.target !== data.payload.nodeId
    )
  );
};

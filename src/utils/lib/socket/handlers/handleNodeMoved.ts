import { useReactFlowStore } from '@/utils/stores';
import { reactFlow } from '../../reactFlow/instance';

export const handleNodeMoved = (data: any) => {
  const { nodes } = useReactFlowStore.getState();

  reactFlow.setNodes(
    nodes.map((node) =>
      node.id === data.payload.nodeId ? { ...node, position: data.payload.position } : node
    )
  );
};

import { useReactFlowStore } from '@/utils/stores';
import { reactFlow } from '../../reactFlow/instance';

export const handleNodeDataUpdated = (data: any) => {
  const { nodes } = useReactFlowStore.getState();

  reactFlow.setNodes(
    nodes.map((node) =>
      node.id === data.payload.nodeId
        ? { ...node, data: { ...node.data, ...data.payload.newData } }
        : node
    )
  );
};

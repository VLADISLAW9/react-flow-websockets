import { useReactFlowStore } from '@/utils/stores';

export const handleNodeDataUpdated = (data: any) => {
  const { nodes, setNodes } = useReactFlowStore.getState();

  setNodes(
    nodes.map((node) =>
      node.id === data.payload.nodeId
        ? { ...node, data: { ...node.data, ...data.payload.newData } }
        : node
    )
  );
};

import { useReactFlowStore } from '@/utils/stores';

export const handleNodeMoved = (data: any) => {
  const { nodes, setNodes } = useReactFlowStore.getState();

  setNodes(
    nodes.map((node) =>
      node.id === data.payload.nodeId ? { ...node, position: data.payload.position } : node
    )
  );
};

import { useReactFlowStore } from '@/utils/stores';

export const handleNodeAdded = (data: any) => {
  const { nodes, setNodes } = useReactFlowStore.getState();
  setNodes([...nodes, data.payload.node]);
};

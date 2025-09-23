import { useReactFlowStore } from '@/utils/stores';
import { reactFlow } from '../../reactFlow/instance';

export const handleNodeAdded = (data: any) => {
  const { nodes } = useReactFlowStore.getState();

  reactFlow.setNodes([...nodes, data.payload.node]);
};

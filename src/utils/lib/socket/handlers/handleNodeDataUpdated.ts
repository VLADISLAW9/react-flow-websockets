import { reactFlow } from '../../reactFlow/instance';

export const handleNodeDataUpdated = (data: any) => {
  reactFlow.applyUpdate(data.update);
};

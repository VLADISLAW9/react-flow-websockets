import { reactFlow } from '../../reactFlow/instance';

export const handleNodeAdded = (data: any) => {
  reactFlow.addNode(data.payload.node);
};

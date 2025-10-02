import { canvas } from '../../canvas/instance';

export const handleNodeDataUpdated = (data: any) => {
  canvas.applyNodeUpdate(data.nodeId, data.update);
};

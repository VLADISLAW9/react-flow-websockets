import { canvas } from '../../canvas/instance';

export const handleNodeDataUpdated = (data: any) => {
  canvas.applyUpdate(data.update);
};

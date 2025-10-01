import { canvas } from '../../canvas/instance';

export const handleNodeAdded = (data: any) => {
  canvas.addNode(data.node);
};

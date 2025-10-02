import { canvas } from '../../canvas/instance';

export const handleNodeMoved = (data: any) => {
  const node = canvas.getNode(data.nodeId);

  if (!node) return;

  node.position = data.position;

  canvas.setNode(node, false);
};

import { canvas } from '../../canvas/instance';

export const handleNodeMoved = (data: any) => {
  const nodes = canvas.getNodes();

  console.log(data);

  canvas.setNodes(
    nodes.map((node) => (node.id === data.nodeId ? { ...node, position: data.position } : node))
  );
};

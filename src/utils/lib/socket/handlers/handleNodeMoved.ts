import { canvas } from '../../canvas/instance';

export const handleNodeMoved = (data: any) => {
  const nodes = canvas.getNodes();

  canvas.setNodes(
    nodes.map((node) =>
      node.id === data.payload.nodeId ? { ...node, position: data.payload.position } : node
    )
  );
};

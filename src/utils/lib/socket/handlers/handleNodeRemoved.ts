import { canvas } from '../../canvas/instance';

export const handleNodeRemoved = (data: any) => {
  const nodes = canvas.getNodes();
  const edges = canvas.getEdges();

  canvas.setNodes(nodes.filter((n) => n.id !== data.nodeId));
  canvas.setEdges(
    edges.filter((edge) => edge.source !== data.nodeId && edge.target !== data.nodeId)
  );
};

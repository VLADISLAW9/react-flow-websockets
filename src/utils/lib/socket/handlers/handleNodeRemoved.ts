import { canvas } from '../../canvas/instance';

export const handleNodeRemoved = (data: any) => {
  const nodes = canvas.getNodes();
  const edges = canvas.getEdges();

  canvas.setNodes(nodes.filter((n) => n.id !== data.payload.nodeId));
  canvas.setEdges(
    edges.filter(
      (edge) => edge.source !== data.payload.nodeId && edge.target !== data.payload.nodeId
    )
  );
};

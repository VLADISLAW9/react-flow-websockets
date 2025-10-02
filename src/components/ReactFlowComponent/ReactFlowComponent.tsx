import type { OnNodeDrag } from '@xyflow/react';
import type { MouseEvent } from 'react';

import { Background, Controls, MiniMap, ReactFlow, useReactFlow } from '@xyflow/react';

import type { AppNode } from '@/utils/types/AppNode';

import { canvas } from '@/utils/lib/canvas/instance';
import { members } from '@/utils/lib/members/instance';
import { useReactFlowStore } from '@/utils/stores';

import { MdiCursorDefault } from '../icons/MdiCursorDefault';
import { Node } from './components';

import '@xyflow/react/dist/style.css';

const NODE_TYPES = { node: Node };

export const ReactFlowComponent = () => {
  const { screenToFlowPosition } = useReactFlow();
  const { onConnect, onEdgesChange, onNodesChange } = useReactFlowStore();

  const nodes = canvas.getNodes();
  const edges = canvas.getEdges();
  const cursors = members.getCursors();

  console.log(nodes);

  const onNodeDrag: OnNodeDrag<AppNode> = (_, node) => canvas.moveNode(node);

  const onMouseMove = (event: MouseEvent) =>
    canvas.moveCursor(screenToFlowPosition({ x: event.clientX, y: event.clientY }));

  return (
    <ReactFlow
      edges={edges}
      nodes={nodes}
      nodeTypes={NODE_TYPES}
      onConnect={onConnect}
      onEdgesChange={onEdgesChange}
      onMouseMove={onMouseMove}
      onNodeDrag={onNodeDrag}
      onNodesChange={onNodesChange}
    >
      {cursors.map((cursor) => (
        <div
          key={cursor.userId}
          style={{
            transform: `translate(${cursor.position.x}px, ${cursor.position.y}px)`,
            color: cursor.color
          }}
          className='absolute transition-transform duration-100 z-10'
        >
          <div className='flex items-center'>
            <MdiCursorDefault color={cursor.color} />
            <span className='ml-1 text-xs'>{cursor.name}</span>
          </div>
        </div>
      ))}
      <Background />
      <Controls />
      <MiniMap pannable zoomable />
    </ReactFlow>
  );
};

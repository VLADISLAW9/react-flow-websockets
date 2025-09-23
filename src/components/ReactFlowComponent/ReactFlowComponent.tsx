import type { OnNodeDrag } from '@xyflow/react';

import { Background, Controls, MiniMap, ReactFlow, useReactFlow } from '@xyflow/react';

import type { AppNode } from '@/utils/types/AppNode';

import { useCursorsStore, useReactFlowStore } from '@/utils/stores';

import { MdiCursorDefault } from '../icons/MdiCursorDefault';
import { Node } from './components';

import '@xyflow/react/dist/style.css';
import { reactFlow } from '@/utils/lib/reactFlow/instance';
import type { MouseEvent } from 'react';

const NODE_TYPES = {
  node: Node
};

export const ReactFlowComponent = () => {
  const { screenToFlowPosition } = useReactFlow();

  const { cursors } = useCursorsStore();
  const { edges, nodes, onConnect, onEdgesChange, onNodesChange } = useReactFlowStore();

  const onNodeDrag: OnNodeDrag<AppNode> = (_, node) => reactFlow.moveNode(node);

  const onMouseMove = (event: MouseEvent) => {
    reactFlow.moveCursor(
      screenToFlowPosition({
        x: event.clientX,
        y: event.clientY
      })
    );
  };

  return (
    <ReactFlow
      edges={edges}
      nodes={nodes}
      nodeTypes={NODE_TYPES}
      onConnect={onConnect}
      onMouseMove={onMouseMove}
      onEdgesChange={onEdgesChange}
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

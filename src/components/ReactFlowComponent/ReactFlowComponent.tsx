import type { OnNodeDrag } from '@xyflow/react';

import { useDidUpdate, useMouse } from '@siberiacancode/reactuse';
import { Background, Controls, MiniMap, ReactFlow, useReactFlow } from '@xyflow/react';
import { useEffect } from 'react';
import { useShallow } from 'zustand/shallow';

import type { AppNode } from '@/utils/types/AppNode';

import { socketActions } from '@/utils/lib/socket';
import { bindReactFlow } from '@/utils/lib/yjs-bindings';
import { yDoc } from '@/utils/lib/yjs-provider';
import { useReactFlowStore, useRoomStore } from '@/utils/stores';

import { MdiCursorDefault } from '../icons/MdiCursorDefault';
import { Node } from './components';

import '@xyflow/react/dist/style.css';

const NODE_TYPES = {
  node: Node
};

export const ReactFlowComponent = () => {
  const { ref, x, y } = useMouse<HTMLDivElement>();
  const { screenToFlowPosition } = useReactFlow();

  const { edges, nodes, onConnect, onEdgesChange, onNodesChange } = useReactFlowStore(
    useShallow((state) => ({
      edges: state.edges,
      nodes: state.nodes,
      onConnect: state.onConnect,
      onEdgesChange: state.onEdgesChange,
      onNodesChange: state.onNodesChange
    }))
  );

  const { cursors } = useRoomStore(
    useShallow((state) => ({
      cursors: state.cursors
    }))
  );

  const onNodeDrag: OnNodeDrag<AppNode> = (_, node) =>
    socketActions.moveNode(node.id, node.position);

  useDidUpdate(() => {
    socketActions.moveCursor(screenToFlowPosition({ x, y }));
  }, [x, y]);

  useEffect(() => {
    const { setNodes, setEdges } = useReactFlowStore.getState();
    const unbind = bindReactFlow(yDoc, setNodes, setEdges);
    return () => unbind();
  }, []);

  return (
    <ReactFlow
      ref={ref}
      edges={edges}
      nodes={nodes}
      nodeTypes={NODE_TYPES}
      onConnect={onConnect}
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

import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  useReactFlow,
  type OnNodeDrag,
} from "@xyflow/react";
import { useShallow } from "zustand/shallow";

import { useReactFlowStore, useRoomStore } from "@/utils/stores";

import { Node } from "./components";

import "@xyflow/react/dist/style.css";
import { socketActions } from "@/utils/lib/socket";
import type { AppNode } from "@/utils/types/AppNode";
import { useDidUpdate, useMouse } from "@siberiacancode/reactuse";
import { MdiCursorDefault } from "../icons/MdiCursorDefault";

const NODE_TYPES = {
  node: Node,
};

export const ReactFlowComponent = () => {
  const { ref, x, y } = useMouse<HTMLDivElement>();
  const { screenToFlowPosition } = useReactFlow();

  const { edges, nodes, onConnect, onEdgesChange, onNodesChange } =
    useReactFlowStore(
      useShallow((state) => ({
        edges: state.edges,
        nodes: state.nodes,
        onConnect: state.onConnect,
        onEdgesChange: state.onEdgesChange,
        onNodesChange: state.onNodesChange,
      })),
    );

  const { cursors } = useRoomStore(
    useShallow((state) => ({
      cursors: state.cursors,
    })),
  );

  const onNodeDrag: OnNodeDrag<AppNode> = (_, node) =>
    socketActions.moveNode(node.id, node.position);

  useDidUpdate(() => {
    socketActions.moveCursor(screenToFlowPosition({ x, y }));
  }, [x, y]);

  return (
    <ReactFlow
      ref={ref}
      edges={edges}
      nodes={nodes}
      onNodeDrag={onNodeDrag}
      nodeTypes={NODE_TYPES}
      onConnect={onConnect}
      onEdgesChange={onEdgesChange}
      onNodesChange={onNodesChange}
    >
      {cursors.map((cursor) => (
        <div
          key={cursor.userId}
          className="absolute transition-transform duration-100 z-10"
          style={{
            transform: `translate(${cursor.position.x}px, ${cursor.position.y}px)`,
            color: cursor.color,
          }}
        >
          <div className="flex items-center">
            <MdiCursorDefault color={cursor.color} />
            <span className="ml-1 text-xs">{cursor.name}</span>
          </div>
        </div>
      ))}
      <Background />
      <Controls />
      <MiniMap pannable zoomable />
    </ReactFlow>
  );
};

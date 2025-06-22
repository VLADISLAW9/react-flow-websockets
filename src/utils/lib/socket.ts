import type { Edge } from '@xyflow/react';

import * as Y from 'yjs';

import type { AppNode } from '@/utils/types/AppNode';

import type { User } from '../types';

import { useProfileStore, useReactFlowStore, useRoomStore } from '../stores';

export interface SocketMessage {
  payload: any;
  type:
    | 'CURSOR_MOVED'
    | 'NODE_ADDED'
    | 'NODE_DATA_UPDATED'
    | 'NODE_MOVED'
    | 'NODE_REMOVED'
    | 'ROOM_JOINED'
    | 'USER_LEFT';
}

export const yDoc = new Y.Doc();
export const yNodes = yDoc.getArray<AppNode>('nodes');
export const yEdges = yDoc.getArray<Edge>('edges');

export const socket = new WebSocket('ws://192.168.0.106:9000');

socket.onmessage = (event) => {
  try {
    const data: SocketMessage = JSON.parse(event.data);

    const { setRoomId, setUsers, users, cursors, setCursors } = useRoomStore.getState();
    const { setProfile } = useProfileStore.getState();

    if (data.type === 'ROOM_JOINED') {
      const currentUser = data.payload.currentUser as User;
      const users = data.payload.users as User[];

      setProfile(currentUser);
      setRoomId(data.payload.roomId);
      setUsers(users);
      setCursors(
        users
          .filter((user) => user.id !== currentUser.id)
          .map((user) => ({
            userId: user.id,
            position: { x: 0, y: 0 },
            color: user.color,
            name: user.name,
            lastUpdated: Date.now()
          }))
      );

      yNodes.delete(0, yNodes.length);
      yNodes.push(Array.isArray(data.payload.flowState.nodes) ? data.payload.flowState.nodes : []);

      yEdges.delete(0, yEdges.length);
      yEdges.push(Array.isArray(data.payload.flowState.edges) ? data.payload.flowState.edges : []);

      return;
    }

    if (data.type === 'NODE_ADDED') {
      yNodes.push([data.payload.node]);
      return;
    }

    if (data.type === 'NODE_REMOVED') {
      const idx = yNodes.toArray().findIndex((n) => n.id === data.payload.nodeId);
      if (idx !== -1) yNodes.delete(idx, 1);

      const edges = yEdges
        .toArray()
        .filter((e) => e.source !== data.payload.nodeId && e.target !== data.payload.nodeId);

      yEdges.delete(0, yEdges.length);
      yEdges.push(edges);

      return;
    }

    if (data.type === 'NODE_DATA_UPDATED') {
      const index = yNodes.toArray().findIndex((n) => n.id === data.payload.nodeId);

      if (index !== -1) {
        const existing = yNodes.get(index);

        yNodes.delete(index, 1);
        yNodes.insert(index, [
          { ...existing, data: { ...existing.data, ...data.payload.newData } }
        ]);
      }

      return;
    }

    if (data.type === 'NODE_MOVED') {
      const index = yNodes.toArray().findIndex((n) => n.id === data.payload.nodeId);

      if (index !== -1) {
        const existing = yNodes.get(index);

        yNodes.delete(index, 1);
        yNodes.insert(index, [{ ...existing, position: data.payload.position }]);
      }

      return;
    }

    if (data.type === 'CURSOR_MOVED') {
      setCursors(
        cursors.map((cursor) => (cursor.userId === data.payload.userId ? data.payload : cursor))
      );
    }

    if (data.type === 'USER_LEFT') {
      setUsers(users.filter((u) => u.id !== data.payload.userId));
      setCursors(cursors.filter((c) => c.userId !== data.payload.userId));
    }
  } catch (err) {
    console.warn(`[WebSocket] error: ${err}`);
  }
};

export const socketActions = {
  addNode: (node: AppNode) => {
    yNodes.push([node]);
    socket.send(JSON.stringify({ type: 'ADD_NODE', payload: { node } }));
  },

  removeNode: (nodeId: string) => {
    const index = yNodes.toArray().findIndex((n) => n.id === nodeId);
    if (index !== -1) yNodes.delete(index, 1);

    const edges = yEdges.toArray().filter((e) => e.source !== nodeId && e.target !== nodeId);

    yEdges.delete(0, yEdges.length);
    yEdges.push(edges);

    socket.send(JSON.stringify({ type: 'REMOVE_NODE', payload: { nodeId } }));
  },

  moveNode: (nodeId: string, position: { x: number; y: number }) => {
    const index = yNodes.toArray().findIndex((n) => n.id === nodeId);

    if (index !== -1) {
      const existing = yNodes.get(index);

      yNodes.delete(index, 1);
      yNodes.insert(index, [{ ...existing, position }]);
    }

    socket.send(JSON.stringify({ type: 'MOVE_NODE', payload: { nodeId, position } }));
  },

  updateNodeData: (nodeId: string, newData: any) => {
    const index = yNodes.toArray().findIndex((n) => n.id === nodeId);

    if (index !== -1) {
      const existing = yNodes.get(index);

      yNodes.delete(index, 1);
      yNodes.insert(index, [{ ...existing, data: { ...existing.data, ...newData } }]);
    }

    socket.send(JSON.stringify({ type: 'UPDATE_NODE_DATA', payload: { nodeId, newData } }));
  },

  moveCursor: (position: { x: number; y: number }) =>
    socket.send(JSON.stringify({ type: 'MOVE_CURSOR', payload: { position } })),

  joinRoom: (roomId: string) =>
    socket.send(JSON.stringify({ type: 'JOIN_ROOM', payload: { roomId } })),

  leaveRoom: (userId: number) =>
    socket.send(JSON.stringify({ type: 'LEAVE_ROOM', payload: { userId } }))
};

yNodes.observeDeep(() => {
  const { setNodes } = useReactFlowStore.getState();
  setNodes(yNodes.toArray());
});

yEdges.observeDeep(() => {
  const { setEdges } = useReactFlowStore.getState();
  setEdges(yEdges.toArray());
});

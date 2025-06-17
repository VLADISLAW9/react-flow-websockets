import * as Y from 'yjs';

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

export const socket = new WebSocket('ws://localhost:9000');

const yDoc = new Y.Doc();
export const yMap = yDoc.getMap();

socket.onmessage = (event) => {
  const data: SocketMessage = JSON.parse(event.data);

  const { setNodes, setEdges, nodes, edges } = useReactFlowStore.getState();
  const { setRoomId, setUsers, users, cursors, setCursors } = useRoomStore.getState();
  const { setProfile } = useProfileStore.getState();

  console.log('[WebSocket] Message received:', data);

  if (data.type === 'ROOM_JOINED') {
    const currentUser = data.payload.currentUser as User;
    const users = data.payload.users as User[];

    setProfile(currentUser);
    setRoomId('1');
    setUsers(users);
    setNodes(data.payload.flowState.nodes);
    setEdges(data.payload.flowState.edges);
    setCursors(
      users
        .filter((user) => user.id !== currentUser.id)
        .map((user: User) => ({
          userId: user.id,
          position: { x: 0, y: 0 },
          color: user.color,
          name: user.name,
          lastUpdated: Date.now()
        }))
    );
    return;
  }

  if (data.type === 'CURSOR_MOVED')
    return setCursors(
      cursors.map((cursor) => (cursor.userId === data.payload.userId ? data.payload : cursor))
    );

  if (data.type === 'NODE_ADDED') return setNodes([...nodes, data.payload.node]);

  if (data.type === 'NODE_REMOVED') {
    setNodes(nodes.filter((n) => n.id !== data.payload.nodeId));
    setEdges(
      edges.filter(
        (edge) => edge.source !== data.payload.nodeId && edge.target !== data.payload.nodeId
      )
    );
    return;
  }

  if (data.type === 'NODE_DATA_UPDATED')
    return setNodes(
      nodes.map((node) =>
        node.id === data.payload.nodeId
          ? { ...node, data: { ...node.data, ...data.payload.newData } }
          : node
      )
    );

  if (data.type === 'NODE_MOVED')
    return setNodes(
      nodes.map((node) =>
        node.id === data.payload.nodeId ? { ...node, position: data.payload.position } : node
      )
    );

  if (data.type === 'USER_LEFT') {
    setUsers(users.filter((user) => user.id !== data.payload.userId));
    setCursors(cursors.filter((cursor) => cursor.userId !== data.payload.userId));
  }
};

export const socketActions = {
  addNode: (node: any) => socket.send(JSON.stringify({ type: 'ADD_NODE', payload: { node } })),

  removeNode: (nodeId: string) =>
    socket.send(JSON.stringify({ type: 'REMOVE_NODE', payload: { nodeId } })),

  moveCursor: (position: { x: number; y: number }) =>
    socket.send(JSON.stringify({ type: 'MOVE_CURSOR', payload: { position } })),

  leaveRoom: (userId: number) =>
    socket.send(JSON.stringify({ type: 'LEAVE_ROOM', payload: { userId } })),

  joinRoom: (roomId: string) =>
    socket.send(JSON.stringify({ type: 'JOIN_ROOM', payload: { roomId } })),

  moveNode: (nodeId: string, position: { x: number; y: number }) =>
    socket.send(JSON.stringify({ type: 'MOVE_NODE', payload: { nodeId, position } })),

  updateNodeData: (nodeId: string, newData: any) =>
    socket.send(
      JSON.stringify({
        type: 'UPDATE_NODE_DATA',
        payload: { nodeId, newData }
      })
    )
};

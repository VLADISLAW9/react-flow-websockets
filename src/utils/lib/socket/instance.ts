import type { User } from '@/utils/types';

import {
  useCursorsStore,
  useProfileStore,
  useReactFlowStore,
  useRoomStore,
  useUsersStore
} from '@/utils/stores';

import { Socket } from './class';

const SOCKET_EVENT_TYPE = {
  CURSOR_MOVED: 'CURSOR_MOVED',
  NODE_ADDED: 'NODE_ADDED',
  NODE_DATA_UPDATED: 'NODE_DATA_UPDATED',
  NODE_MOVED: 'NODE_MOVED',
  NODE_REMOVED: 'NODE_REMOVED',
  ROOM_JOINED: 'ROOM_JOINED',
  USER_LEFT: 'USER_LEFT'
} as const;

export const socket = new Socket('ws://localhost:9000');

socket.on(SOCKET_EVENT_TYPE.CURSOR_MOVED, (data: any) => {
  const { cursors, setCursors } = useCursorsStore.getState();
  setCursors(cursors.map((cursor) => (cursor.userId === data.userId ? data : cursor)));
});

socket.on(SOCKET_EVENT_TYPE.NODE_ADDED, (data: any) => {
  const { nodes, setNodes } = useReactFlowStore.getState();
  setNodes([...nodes, data.payload.node]);
});

socket.on(SOCKET_EVENT_TYPE.NODE_DATA_UPDATED, (data: any) => {
  const { nodes, setNodes } = useReactFlowStore.getState();

  setNodes(
    nodes.map((node) =>
      node.id === data.payload.nodeId
        ? { ...node, data: { ...node.data, ...data.payload.newData } }
        : node
    )
  );
});

socket.on(SOCKET_EVENT_TYPE.NODE_MOVED, (data: any) => {
  const { nodes, setNodes } = useReactFlowStore.getState();

  setNodes(
    nodes.map((node) =>
      node.id === data.payload.nodeId ? { ...node, position: data.payload.position } : node
    )
  );
});

socket.on(SOCKET_EVENT_TYPE.NODE_REMOVED, (data: any) => {
  const { setNodes, edges, nodes, setEdges } = useReactFlowStore.getState();

  setNodes(nodes.filter((n) => n.id !== data.payload.nodeId));
  setEdges(
    edges.filter(
      (edge) => edge.source !== data.payload.nodeId && edge.target !== data.payload.nodeId
    )
  );
});

socket.on(SOCKET_EVENT_TYPE.USER_LEFT, (data: any) => {
  const { setUsers, users } = useUsersStore.getState();
  const { cursors, setCursors } = useCursorsStore.getState();

  setUsers(users.filter((user) => user.id !== data.payload.userId));
  setCursors(cursors.filter((cursor) => cursor.userId !== data.payload.userId));
});

socket.on(SOCKET_EVENT_TYPE.ROOM_JOINED, (data: any) => {
  const { setProfile } = useProfileStore.getState();
  const { setUsers } = useUsersStore.getState();
  const { setRoom } = useRoomStore.getState();
  const { setCursors } = useCursorsStore.getState();
  const { setEdges, setNodes } = useReactFlowStore.getState();

  const currentUser = data.currentUser as User;
  const users = data.users as User[];

  setProfile(currentUser);
  setRoom('1');
  setUsers(users);
  setNodes(data.flowState.nodes);
  setEdges(data.flowState.edges);
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
});

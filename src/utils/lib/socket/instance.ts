import { Socket } from './class';
import {
  handleCursorMoved,
  handleNodeAdded,
  handleNodeDataUpdated,
  handleNodeMoved,
  handleNodeRemoved,
  handleRoomJoined,
  handleUserLeft
} from './handlers';

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

socket.on(SOCKET_EVENT_TYPE.CURSOR_MOVED, handleCursorMoved);
socket.on(SOCKET_EVENT_TYPE.NODE_ADDED, handleNodeAdded);
socket.on(SOCKET_EVENT_TYPE.NODE_DATA_UPDATED, handleNodeDataUpdated);
socket.on(SOCKET_EVENT_TYPE.NODE_MOVED, handleNodeMoved);
socket.on(SOCKET_EVENT_TYPE.NODE_REMOVED, handleNodeRemoved);
socket.on(SOCKET_EVENT_TYPE.USER_LEFT, handleUserLeft);
socket.on(SOCKET_EVENT_TYPE.ROOM_JOINED, handleRoomJoined);

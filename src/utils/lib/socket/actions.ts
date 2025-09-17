import { socket } from './instance';

export const socketActions = {
  addNode: (node: any) => socket.send({ type: 'ADD_NODE', payload: { node } }),

  removeNode: (nodeId: string) => socket.send({ type: 'REMOVE_NODE', payload: { nodeId } }),

  leaveRoom: (userId: number) => socket.send({ type: 'LEAVE_ROOM', payload: { userId } }),

  joinRoom: (roomId: string) => socket.send({ type: 'JOIN_ROOM', payload: { roomId } }),

  moveNode: (nodeId: string, position: { x: number; y: number }) =>
    socket.send({ type: 'MOVE_NODE', payload: { nodeId, position } }),

  moveCursor: (position: { x: number; y: number }) =>
    socket.send({ type: 'MOVE_CURSOR', payload: { position } }),

  updateNodeData: (nodeId: string, newData: any) =>
    socket.send({
      type: 'UPDATE_NODE_DATA',
      payload: { nodeId, newData }
    })
};

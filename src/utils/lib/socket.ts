import { useReactFlowStore, useRoomStore } from '../stores';

export const socket = new WebSocket('ws://localhost:9000');

interface SocketMessage {
  payload: any;
  type:
    | 'NODE_ADDED'
    | 'NODE_DATA_UPDATED'
    | 'NODE_MOVED'
    | 'NODE_REMOVED'
    | 'ROOM_JOINED'
    | 'USER_LEFT';
}

export const initSocket = () => {
  socket.onmessage = (event) => {
    try {
      const data: SocketMessage = JSON.parse(event.data);
      const { setNodes, setEdges, nodes, edges } = useReactFlowStore.getState();
      const { setRoomId, setUsers, users } = useRoomStore.getState();

      console.log('[WebSocket] Message received:', data);

      switch (data.type) {
        case 'ROOM_JOINED':
          setRoomId('1');
          setUsers(data.payload.clients);
          setNodes(data.payload.flowState.nodes);
          setEdges(data.payload.flowState.edges);
          break;

        case 'NODE_ADDED':
          setNodes([...nodes, data.payload.node]);
          break;

        case 'NODE_REMOVED':
          setNodes(nodes.filter((n) => n.id !== data.payload.nodeId));
          setEdges(
            edges.filter(
              (edge) => edge.source !== data.payload.nodeId && edge.target !== data.payload.nodeId
            )
          );
          break;

        case 'NODE_DATA_UPDATED':
          setNodes(
            nodes.map((node) =>
              node.id === data.payload.nodeId
                ? { ...node, data: { ...node.data, ...data.payload.newData } }
                : node
            )
          );
          break;

        case 'NODE_MOVED':
          setNodes(
            nodes.map((node) =>
              node.id === data.payload.nodeId ? { ...node, position: data.payload.position } : node
            )
          );
          break;

        case 'USER_LEFT':
          setUsers(users.filter((user) => user !== data.payload.userId));
          break;

        default:
          console.warn('Unknown message type:', data.type);
      }
    } catch (error) {
      console.error('Error processing WebSocket message:', error);
    }
  };

  socket.onerror = (error) => {
    console.error('[WebSocket] Error:', error);
  };

  socket.onclose = (event) => {
    console.log(`[WebSocket] Closed with code ${event.code}, reason: ${event.reason}`);
  };
};

export const socketActions = {
  addNode: (node: any) => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(
        JSON.stringify({
          type: 'ADD_NODE',
          payload: { node }
        })
      );
    } else {
      console.warn('WebSocket is not open. Cannot add node.');
    }
  },

  removeNode: (nodeId: string) => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(
        JSON.stringify({
          type: 'REMOVE_NODE',
          payload: { nodeId }
        })
      );
    }
  },

  updateNodeData: (nodeId: string, newData: any) => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(
        JSON.stringify({
          type: 'UPDATE_NODE_DATA',
          payload: { nodeId, newData }
        })
      );
    }
  },

  moveNode: (nodeId: string, position: { x: number; y: number }) => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(
        JSON.stringify({
          type: 'MOVE_NODE',
          payload: { nodeId, position }
        })
      );
    }
  },

  joinRoom: (roomId: string) => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(
        JSON.stringify({
          type: 'JOIN_ROOM',
          payload: { roomId }
        })
      );
    }
  }
};

import { useEffect } from 'react';

import { ReactFlowComponent, ToolsBar } from './components';
import { initSocket, socket, socketActions } from './utils/lib/socket';

export const App = () => {
  useEffect(() => {
    initSocket();

    socket.onopen = () => {
      console.log('[WebSocket] Connection established');

      socketActions.joinRoom('default-room');
    };

    socket.onclose = () => {
      console.log('[WebSocket] Connection closed');
    };

    return () => {
      socket.close();
    };
  }, []);

  return (
    <div className='flex h-screen'>
      <ToolsBar />
      <ReactFlowComponent />
    </div>
  );
};

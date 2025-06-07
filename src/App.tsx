import { useEffect } from 'react';

import { ReactFlowComponent, ToolsBar } from './components';
import { socket, socketActions } from './utils/lib';

export const App = () => {
  useEffect(() => {
    socket.onopen = () => socketActions.joinRoom('1');

    socket.onerror = (error) => console.log(`[WebSocket] error ${error}`);

    return () => {
      socket.close = () => console.log(`[WebSocket] close`);
    };
  }, []);

  return (
    <div className='flex h-screen'>
      <ToolsBar />

      <ReactFlowComponent />
    </div>
  );
};

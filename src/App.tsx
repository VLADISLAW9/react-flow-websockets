import { useEffect } from 'react';

import { NodeDrawer, ReactFlowComponent, ToolsBar } from './components';
import { socket, socketActions } from './utils/lib';
import { useNodeDrawerStore } from './utils/stores';

export const App = () => {
  const nodeDrawerStore = useNodeDrawerStore();

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
      {nodeDrawerStore.node && (
        <NodeDrawer close={nodeDrawerStore.close} node={nodeDrawerStore.node} />
      )}
    </div>
  );
};

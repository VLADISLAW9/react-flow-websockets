import { useEffect } from 'react';

import { NodeDrawer, ReactFlowComponent, ToolsBar } from './components';
import { socket, socketActions } from './utils/lib';
import { useNodeDrawerStore, useReactFlowStore } from './utils/stores';

export const App = () => {
  const reactFlowStore = useReactFlowStore();
  const nodeDrawerStore = useNodeDrawerStore();

  const nodeDrawerData = reactFlowStore.getNodeById(nodeDrawerStore.nodeId);

  useEffect(() => {
    socket.onopen = () => {
      console.log('[WebSocket] opened');
      socketActions.joinRoom('1');
    };

    socket.onerror = (error) => console.error('[WebSocket] error', error);

    return () => {
      socket.onclose = () => console.warn('[WebSocket] closed');
    };
  }, []);

  return (
    <div className='flex h-screen'>
      <ToolsBar />
      <ReactFlowComponent />
      {nodeDrawerData && <NodeDrawer close={nodeDrawerStore.close} node={nodeDrawerData} />}
    </div>
  );
};

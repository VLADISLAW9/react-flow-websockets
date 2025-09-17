import { NodeDrawer, ReactFlowComponent, ToolsBar } from './components';
import { useSocket } from './utils/lib/socket';
import { useNodeDrawerStore } from './utils/stores';

export const App = () => {
  const nodeDrawerStore = useNodeDrawerStore();

  useSocket();

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

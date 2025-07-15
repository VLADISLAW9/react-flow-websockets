import { Flex } from '@mantine/core';

import { NodeDrawer, ReactFlowComponent, ToolsBar } from './components';
import { CollaborativeProvider } from './utils/contexts/collaborative';
import { useNodeDrawerStore, useReactFlowStore } from './utils/stores';

export const App = () => {
  const reactFlowStore = useReactFlowStore();
  const nodeDrawerStore = useNodeDrawerStore();

  const nodeDrawerData = reactFlowStore.getNodeById(nodeDrawerStore.nodeId);

  return (
    <Flex>
      <ToolsBar />
      <CollaborativeProvider>
        <Flex h='100vh' w='100vw'>
          <ReactFlowComponent />
          {nodeDrawerData && <NodeDrawer close={nodeDrawerStore.close} node={nodeDrawerData} />}
        </Flex>
      </CollaborativeProvider>
    </Flex>
  );
};

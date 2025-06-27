import { Flex } from '@mantine/core';

import { NodeDrawer, ReactFlowComponent, ToolsBar } from './components';
import { CollabarativeProvider } from './components/CollabarativeProvider/CollabarativeProvider';
import { useNodeDrawerStore, useReactFlowStore } from './utils/stores';

export const App = () => {
  const reactFlowStore = useReactFlowStore();
  const nodeDrawerStore = useNodeDrawerStore();

  const nodeDrawerData = reactFlowStore.getNodeById(nodeDrawerStore.nodeId);

  return (
    <Flex>
      <ToolsBar />
      <CollabarativeProvider>
        <ReactFlowComponent />
        {nodeDrawerData && <NodeDrawer close={nodeDrawerStore.close} node={nodeDrawerData} />}
      </CollabarativeProvider>
    </Flex>
  );
};

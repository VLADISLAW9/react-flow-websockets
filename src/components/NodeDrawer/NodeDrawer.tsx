import { Drawer, Input, Textarea } from '@mantine/core';

import type { AppNode } from '@/utils/types';

import { socketActions } from '@/utils/lib';
import { useReactFlowStore } from '@/utils/stores';
import type { ChangeEvent } from 'react';

interface NodeDrawerProps {
  node: AppNode;
  close: () => void;
}

export const NodeDrawer = ({ node, close }: NodeDrawerProps) => {
  const { setNodeData } = useReactFlowStore();

  const onNodeLabelChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const label = event.target.value;

    setNodeData(node.id, { label });

    socketActions.updateNodeData(node.id, { ...node.data, label });
  };

  return (
    <Drawer withOverlay={false} onClose={close} opened={!!node} position='right'>
      <Textarea value={node.data.label} onChange={onNodeLabelChange} />
    </Drawer>
  );
};

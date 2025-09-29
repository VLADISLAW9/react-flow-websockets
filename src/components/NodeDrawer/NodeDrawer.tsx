import { Drawer, Input } from '@mantine/core';

import type { AppNode } from '@/utils/types';

import { canvas } from '@/utils/lib/canvas/instance';

interface NodeDrawerProps {
  node: AppNode;
  close: () => void;
}

export const NodeDrawer = ({ node, close }: NodeDrawerProps) => (
  <Drawer withOverlay={false} onClose={close} opened={!!node} position='right'>
    <Input
      value={node.data.label}
      onChange={(event) => {
        const updatedNode: AppNode = {
          ...node,
          data: { ...node.data, label: event.target.value }
        };

        canvas.setNode(updatedNode);
      }}
    />
  </Drawer>
);

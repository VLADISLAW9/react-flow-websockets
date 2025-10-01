import { Button, Drawer, Flex, Input, Stack, Textarea } from '@mantine/core';

import type { AppNode } from '@/utils/types';

import { useState } from 'react';
import { canvas } from '@/utils/lib/canvas/instance';

interface NodeDrawerProps {
  node: AppNode;
  close: () => void;
}

export const NodeDrawer = ({ node, close }: NodeDrawerProps) => {
  const [label, setLabel] = useState(node.data.label);
  const [description, setDescription] = useState(node.data.description);

  const onSaveChanges = () => {
    const updatedNode: AppNode = { ...node, data: { label, description } };
    canvas.setNode(updatedNode);
  };

  const onCancelChanges = () => {
    setLabel(node.data.label);
    setDescription(node.data.description);
  };

  return (
    <Drawer withOverlay={false} onClose={close} opened={!!node} position='right'>
      <Stack>
        <Input value={label} onChange={(event) => setLabel(event.target.value)} />
        <Textarea value={description} onChange={(event) => setDescription(event.target.value)} />
        <Flex gap='sm'>
          <Button color='red' onClick={onCancelChanges}>
            Отменить
          </Button>
          <Button color='green' onClick={onSaveChanges}>
            Сохранить
          </Button>
        </Flex>
      </Stack>
    </Drawer>
  );
};

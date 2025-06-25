import type { NodeProps } from '@xyflow/react';

import { Button, Group, Paper, Stack, Text, Tooltip } from '@mantine/core';
import { Handle, Position } from '@xyflow/react';

import type { AppNode } from '@/utils/types/AppNode';

import { useNodeDrawerStore, useRoomStore } from '@/utils/stores';

export const Node = ({ id, data, isConnectable }: NodeProps<AppNode>) => {
  const nodeDrawerStore = useNodeDrawerStore();
  const roomStore = useRoomStore();

  const nodeActivity = roomStore.activityNodes.find((node) => node.id === id);
  const isActive = !!nodeActivity?.users?.length;

  const onNodeDrawerOpen = () => {
    nodeDrawerStore.open(id);
    roomStore.activateNode(id);
  };

  const renderTooltipContent = () => (
    <Stack gap={2}>
      {nodeActivity?.users.map((user) => (
        <Text key={user.id} size='xs' c={user.color} fw={600}>
          {user.name} {user.id === roomStore.currentUser?.id && '(Вы)'}
        </Text>
      ))}
    </Stack>
  );

  return (
    <>
      <Handle
        type='target'
        isConnectable={isConnectable}
        position={Position.Left}
        className='z-10'
      />
      <Tooltip
        arrowOffset={10}
        arrowSize={4}
        withArrow
        opened={isActive}
        position='left-start'
        label={renderTooltipContent()}
        withinPortal
      >
        <Paper
          withBorder
          shadow='md'
          radius='md'
          w={120}
          h={140}
          p='xs'
          styles={(theme) => ({
            root: {
              backgroundColor: isActive ? theme.colors.yellow[2] : theme.colors.yellow[1],
              transition: 'all 150ms ease',
              cursor: 'pointer',
              border: isActive
                ? `2px solid ${theme.colors.yellow[5]}`
                : `2px solid ${theme.colors.yellow[1]}`
            }
          })}
        >
          <Group justify='space-between'>
            <Text size='sm' fw={500}>
              {data.label}
            </Text>
            <Button size='compact-xs' variant='outline' color='dark' onClick={onNodeDrawerOpen}>
              {'...'}
            </Button>
          </Group>
        </Paper>
      </Tooltip>
      <Handle
        type='source'
        isConnectable={isConnectable}
        position={Position.Right}
        className='z-10'
      />
    </>
  );
};

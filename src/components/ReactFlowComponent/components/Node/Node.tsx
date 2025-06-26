import type { NodeProps } from '@xyflow/react';

import { Badge, Button, Group, Paper, Stack, Text, Tooltip } from '@mantine/core';
import { Handle, Position } from '@xyflow/react';

import type { AppNode } from '@/utils/types/AppNode';

import { socketActions } from '@/utils/lib';
import { useNodeDrawerStore, useRoomStore } from '@/utils/stores';

export const Node = ({ id, data, isConnectable, selected }: NodeProps<AppNode>) => {
  const nodeDrawerStore = useNodeDrawerStore();
  const roomStore = useRoomStore();

  const nodeActivity = roomStore.activityNodes.find((node) => node.id === id);
  const isActive = !!nodeActivity?.users.length;

  const onNodeDrawerOpen = () => {
    nodeDrawerStore.open(id);
    socketActions.activateNode(id);
  };

  const renderTooltipContent = () => (
    <Stack gap={2}>
      {nodeActivity?.users.map((user) => (
        <Badge key={user.id} fw={600} radius='sm' size='xs' variant='light' color={user.color}>
          {user.name} {user.id === roomStore.currentUser?.id && '(Вы)'}
        </Badge>
      ))}
    </Stack>
  );

  return (
    <>
      <Handle
        style={{ zIndex: 10 }}
        type='target'
        isConnectable={isConnectable}
        position={Position.Left}
      />
      <Tooltip
        label={renderTooltipContent()}
        p={0}
        arrowOffset={10}
        arrowSize={4}
        color='white'
        opened={isActive}
        position='top-start'
        withArrow
        withinPortal
      >
        <Paper
          styles={(theme) => ({
            root: {
              backgroundColor: theme.colors.yellow[1],
              transition: 'all 150ms ease',
              cursor: 'pointer',
              border:
                isActive || selected
                  ? `2px solid ${nodeActivity?.users[nodeActivity?.users.length - 1].color}`
                  : `2px solid ${theme.colors.yellow[1]}`
            }
          })}
          h={140}
          p='xs'
          radius='md'
          w={120}
          shadow='md'
          withBorder
        >
          <Group justify='space-between'>
            <Text fw={500} size='sm'>
              {data.label}
            </Text>
            <Button size='compact-xs' variant='outline' color='dark' onClick={onNodeDrawerOpen}>
              {'...'}
            </Button>
          </Group>
        </Paper>
      </Tooltip>
      <Handle
        style={{ zIndex: 10 }}
        type='source'
        isConnectable={isConnectable}
        position={Position.Right}
      />
    </>
  );
};

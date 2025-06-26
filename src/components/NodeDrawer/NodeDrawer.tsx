import type { ChangeEvent, FocusEvent } from 'react';

import { Box, Drawer, Select, Stack, Switch, Text, Textarea } from '@mantine/core';

import type { AppNode } from '@/utils/types';

import { socketActions } from '@/utils/lib';
import { useReactFlowStore, useRoomStore } from '@/utils/stores';

const INPUT_IDS = {
  LABEL: 'label',
  DESCRIPTION: 'description',
  TYPE: 'type',
  ENABLED: 'enabled'
} as const;

const TYPE_SELECT_DATA = [
  { value: 'Критический', label: 'Критический' },
  { value: 'Средний', label: 'Средний' },
  { value: 'Низкий', label: 'Низкий' }
] as const;

interface NodeDrawerProps {
  node: AppNode;
  close: () => void;
}

export const NodeDrawer = ({ node, close }: NodeDrawerProps) => {
  const reactFlowStore = useReactFlowStore();
  const roomStore = useRoomStore();

  const opened = !!node;
  const activity = roomStore.activityNodes.find(({ id }) => id === node.id);
  const currentUserId = roomStore.currentUser?.id;

  const getInputUsers = (inputId: string) =>
    activity?.inputs.find((input) => input.inputName === inputId)?.users || [];

  const renderInputHighlight = (inputId: string) => {
    const users = getInputUsers(inputId);
    if (!users.length) return null;

    return (
      <Stack gap={2}>
        {users.map((user) => (
          <Text key={user.id} c={user.color} fw={600} size='xs'>
            {user.name} {user.id === currentUserId && '(Вы)'}
          </Text>
        ))}
      </Stack>
    );
  };

  const inputActive = (inputId: string) => getInputUsers(inputId).length > 0;

  const getInputStyle = (inputId: string) =>
    inputActive(inputId) ? { borderColor: getInputUsers(inputId)[0].color } : {};

  const onNodeLabelChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    reactFlowStore.setNodeData(node.id, { label: value });
    socketActions.updateNodeData(node.id, { ...node.data, label: value });
  };

  const onNodeDrawerClose = () => {
    socketActions.diactivateNode(node.id);
    close();
  };

  const onNodeInputFocus = (event: FocusEvent<Element>) => {
    socketActions.activateNodeInput(node.id, event.target.id);
  };

  const onNodeInputBlur = (event: FocusEvent<Element>) => {
    socketActions.diactivateNodeInput(node.id, event.target.id);
  };

  return (
    <Drawer withOverlay={false} onClose={onNodeDrawerClose} opened={opened} position='right'>
      <Stack>
        <Box>
          <Textarea
            id={INPUT_IDS.LABEL}
            label='Имя'
            styles={{ input: getInputStyle(INPUT_IDS.LABEL) }}
            value={node.data.label}
            autosize
            onBlur={onNodeInputBlur}
            onChange={onNodeLabelChange}
            onFocus={onNodeInputFocus}
            placeholder='Имя'
          />
          {renderInputHighlight(INPUT_IDS.LABEL)}
        </Box>

        <Box>
          <Textarea
            id={INPUT_IDS.DESCRIPTION}
            label='Описание'
            styles={{ input: getInputStyle(INPUT_IDS.DESCRIPTION) }}
            autosize
            onBlur={onNodeInputBlur}
            onFocus={onNodeInputFocus}
            placeholder='Описание'
          />
          {renderInputHighlight(INPUT_IDS.DESCRIPTION)}
        </Box>

        <Box>
          <Select
            data={TYPE_SELECT_DATA}
            id={INPUT_IDS.TYPE}
            label='Тип'
            styles={{ input: getInputStyle(INPUT_IDS.TYPE) }}
            onBlur={onNodeInputBlur}
            onFocus={onNodeInputFocus}
            placeholder='Тип'
          />
          {renderInputHighlight(INPUT_IDS.TYPE)}
        </Box>

        <Box>
          <Switch
            id={INPUT_IDS.ENABLED}
            label='Активирован'
            styles={{ track: getInputStyle(INPUT_IDS.ENABLED) }}
            onBlur={onNodeInputBlur}
            onFocus={onNodeInputFocus}
          />
          {renderInputHighlight(INPUT_IDS.ENABLED)}
        </Box>
      </Stack>
    </Drawer>
  );
};

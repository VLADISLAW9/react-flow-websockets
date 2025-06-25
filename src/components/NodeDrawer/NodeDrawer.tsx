import type { ChangeEvent, FocusEvent } from 'react';
import { Drawer, Select, Stack, Switch, Text, Textarea, Box } from '@mantine/core';

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

  const renderInputHighlight = (inputId: string) => {
    const users = getInputUsers(inputId);

    if (!users.length) return null;

    return (
      <Stack gap={2}>
        {users.map((user) => (
          <Text key={user.id} size='xs' c={user.color} fw={600}>
            {user.name} {user.id === currentUserId && '(Вы)'}
          </Text>
        ))}
      </Stack>
    );
  };

  const inputActive = (inputId: string) => getInputUsers(inputId).length > 0;

  const getInputUsers = (inputId: string) =>
    activity?.activityInputs.find((input) => input.inputName === inputId)?.users || [];

  const getInputStyle = (inputId: string) =>
    inputActive(inputId) ? { borderColor: getInputUsers(inputId)[0].color } : {};

  const onNodeLabelChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    reactFlowStore.setNodeData(node.id, { label: event.target.value });
    socketActions.updateNodeData(node.id, { ...node.data, label: event.target.value });
  };

  const onNodeDrawerClose = () => {
    roomStore.diactivateNode(node.id);
    close();
  };

  const onNodeInputFocus = (event: FocusEvent<Element>) => {
    roomStore.activateNodeInput(node.id, event.target.id);
  };

  const onNodeInputBlur = (event: FocusEvent<Element>) => {
    roomStore.diactivateNodeInput(node.id, event.target.id);
  };

  return (
    <Drawer withOverlay={false} onClose={onNodeDrawerClose} opened={opened} position='right'>
      <Stack>
        <Box>
          <Textarea
            id={INPUT_IDS.LABEL}
            label='Имя'
            value={node.data.label}
            autosize
            onBlur={onNodeInputBlur}
            onChange={onNodeLabelChange}
            onFocus={onNodeInputFocus}
            placeholder='Имя'
            styles={{ input: getInputStyle(INPUT_IDS.LABEL) }}
          />
          {renderInputHighlight(INPUT_IDS.LABEL)}
        </Box>

        <Box>
          <Textarea
            id={INPUT_IDS.DESCRIPTION}
            label='Описание'
            autosize
            onFocus={onNodeInputFocus}
            placeholder='Описание'
            styles={{ input: getInputStyle(INPUT_IDS.DESCRIPTION) }}
          />
          {renderInputHighlight(INPUT_IDS.DESCRIPTION)}
        </Box>

        <Box>
          <Select
            id={INPUT_IDS.TYPE}
            data={TYPE_SELECT_DATA}
            label='Тип'
            onFocus={onNodeInputFocus}
            placeholder='Тип'
            styles={{ input: getInputStyle(INPUT_IDS.TYPE) }}
          />
          {renderInputHighlight(INPUT_IDS.TYPE)}
        </Box>

        <Box>
          <Switch
            id={INPUT_IDS.ENABLED}
            label='Активирован'
            onFocus={onNodeInputFocus}
            styles={{ track: getInputStyle(INPUT_IDS.ENABLED) }}
          />
          {renderInputHighlight(INPUT_IDS.ENABLED)}
        </Box>
      </Stack>
    </Drawer>
  );
};

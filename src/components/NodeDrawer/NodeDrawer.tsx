import { Drawer, Input } from '@mantine/core';
import { useField } from '@siberiacancode/reactuse';

import type { AppNode } from '@/utils/types';

interface NodeDrawerProps {
  node: AppNode;
  close: () => void;
}

export const NodeDrawer = ({ node, close }: NodeDrawerProps) => {
  const labelInput = useField({ initialValue: node.data.label });

  return (
    <Drawer withOverlay={false} onClose={close} opened={!!node} position='right'>
      <Input {...labelInput.register({ maxLength: { value: 2, message: 'min length is 2' } })} />
    </Drawer>
  );
};

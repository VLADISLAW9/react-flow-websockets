import type { NodeMouseHandler, OnNodeDrag } from '@xyflow/react';

import { createContext } from '@siberiacancode/reactuse';

import type { AppNode } from '@/utils/types';

interface CollaborativeActions {
  onNodeClick: NodeMouseHandler<AppNode>;
  onNodeDrag: OnNodeDrag;
}

export const CollaborativeContext = createContext<CollaborativeActions>(undefined, {
  name: 'CollaborativeContext',
  strict: true
});

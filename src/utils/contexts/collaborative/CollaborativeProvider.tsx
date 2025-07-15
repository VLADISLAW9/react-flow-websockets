import type { NodeMouseHandler, OnNodeDrag } from '@xyflow/react';
import type { ReactNode } from 'react';

import { useCallback, useEffect } from 'react';

import type { AppNode } from '@/utils/types';

import { socket, socketActions } from '@/utils/lib';

import { CollaborativeContext } from './CollaborativeContext';

interface CollaborativeProviderProps {
  children: ReactNode;
}

export const CollaborativeProvider = ({ children }: CollaborativeProviderProps) => {
  const onNodeDrag: OnNodeDrag = useCallback((_, node) => {
    socketActions.moveNode(node.id, node.position);
  }, []);

  const onNodeClick: NodeMouseHandler<AppNode> = useCallback((_, node) => {
    socketActions.activateNode(node.id);
  }, []);

  useEffect(() => {
    socket.onopen = () => {
      console.log('[WebSocket] opened');
      socketActions.joinRoom('1');
    };

    socket.onerror = (error) => console.error('[WebSocket] error', error);

    return () => {
      socket.onclose = () => console.warn('[WebSocket] closed');
    };
  }, []);

  return (
    // eslint-disable-next-line react/no-context-provider
    <CollaborativeContext.Provider
      initialValue={{
        onNodeDrag,
        onNodeClick
      }}
    >
      {children}
    </CollaborativeContext.Provider>
  );
};

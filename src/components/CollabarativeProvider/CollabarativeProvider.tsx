import type { DragEventHandler, MouseEvent, ReactNode } from 'react';

import { Flex } from '@mantine/core';
import { useEffect } from 'react';

import { socket, socketActions } from '@/utils/lib';

interface CollabarativeProviderProps {
  children: ReactNode;
}

export const CollabarativeProvider = ({ children }: CollabarativeProviderProps) => {
  const onClick = (event: MouseEvent<HTMLDivElement, MouseEvent>) => {
    console.log(event);
  };

  const onDrag = (event: DragEventHandler<HTMLDivElement>) => {
    console.log(event);
  };

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
    <Flex h='100vh' w='100vw' onClick={onClick}>
      {children}
    </Flex>
  );
};

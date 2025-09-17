import { useEffect } from 'react';

import { socketActions } from '../actions';
import { socket } from '../instance';

export const useSocket = () => {
  useEffect(() => {
    socket.connect(() => {
      socketActions.joinRoom('1');
    });

    return () => {
      socket.close();
    };
  }, []);
};

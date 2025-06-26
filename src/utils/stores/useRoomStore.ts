import { create } from 'zustand';

import type { AppNode, User, UserCursor } from '../types';

interface ActivityInput {
  inputName: string;
  users: User[];
}

interface ActivityNode {
  id: AppNode['id'];
  inputs: ActivityInput[];
  users: User[];
}

interface UseRoomStore {
  activityNodes: ActivityNode[];
  currentUser: User | null;
  cursors: UserCursor[];
  roomId: string | null;
  users: User[];

  addNodeActiveUser: (nodeId: string, user: User) => void;
  addNodeInputActiveUser: (nodeId: string, inputName: string, user: User) => void;
  removeNodeActiveUser: (nodeId: string, userId: string) => void;
  removeNodeInputActiveUser: (nodeId: string, inputName: string, userId: string) => void;

  setCurrentUser: (user: User) => void;
  setCursors: (cursors: UserCursor[]) => void;

  setRoomId: (roomId: string) => void;
  setUsers: (users: User[]) => void;
}

export const useRoomStore = create<UseRoomStore>((set) => ({
  currentUser: null,
  roomId: null,
  users: [],
  cursors: [],
  activityNodes: [],

  setCurrentUser: (user) => set({ currentUser: user }),
  setRoomId: (roomId) => set({ roomId }),
  setUsers: (users) => set({ users }),
  setCursors: (cursors) => set({ cursors }),

  addNodeActiveUser: (nodeId, user) => {
    set((state) => {
      const node = state.activityNodes.find((n) => n.id === nodeId);

      if (node) {
        if (!node.users.find((u) => u.id === user.id)) {
          node.users.push(user);
        }

        return { activityNodes: [...state.activityNodes] };
      } else {
        return {
          activityNodes: [...state.activityNodes, { id: nodeId, users: [user], inputs: [] }]
        };
      }
    });
  },

  removeNodeActiveUser: (nodeId, userId) => {
    set((state) => {
      const node = state.activityNodes.find((n) => n.id === nodeId);

      if (!node) return {};

      node.users = node.users.filter((u) => u.id !== userId);

      if (node.users.length === 0 && node.inputs.length === 0) {
        return { activityNodes: state.activityNodes.filter((n) => n.id !== nodeId) };
      }

      return { activityNodes: [...state.activityNodes] };
    });
  },

  addNodeInputActiveUser: (nodeId, inputName, user) => {
    set((state) => {
      let node = state.activityNodes.find((n) => n.id === nodeId);

      if (!node) {
        node = { id: nodeId, users: [], inputs: [] };
        state.activityNodes.push(node);
      }

      let input = node.inputs.find((i) => i.inputName === inputName);

      if (!input) {
        input = { inputName, users: [] };
        node.inputs.push(input);
      }

      if (!input.users.find((u) => u.id === user.id)) {
        input.users.push(user);
      }

      return { activityNodes: [...state.activityNodes] };
    });
  },

  removeNodeInputActiveUser: (nodeId, inputName, userId) => {
    set((state) => {
      const node = state.activityNodes.find((n) => n.id === nodeId);

      if (!node) return {};
      const input = node.inputs.find((i) => i.inputName === inputName);

      if (!input) return {};
      input.users = input.users.filter((u) => u.id !== userId);

      if (input.users.length === 0) {
        node.inputs = node.inputs.filter((i) => i.inputName !== inputName);
      }

      if (node.users.length === 0 && node.inputs.length === 0) {
        return { activityNodes: state.activityNodes.filter((n) => n.id !== nodeId) };
      }

      return { activityNodes: [...state.activityNodes] };
    });
  }
}));

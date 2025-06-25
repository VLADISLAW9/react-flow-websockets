import { create } from 'zustand';

import type { AppNode, User, UserCursor } from '../types';

interface ActivityNodeInput {
  inputName: string;
  users: User[];
}

interface ActivityNode {
  activityInputs: ActivityNodeInput[];
  id: AppNode['id'];
  users: User[];
}

interface UseRoomStore {
  activityNodes: ActivityNode[];
  currentUser: User | null;

  cursors: UserCursor[];
  roomId: string | null;

  users: User[];
  activateNode: (nodeId: AppNode['id']) => void;

  activateNodeInput: (nodeId: AppNode['id'], inputName: string) => void;
  diactivateNode: (nodeId: AppNode['id']) => void;

  diactivateNodeInput: (nodeId: AppNode['id'], inputName: string) => void;
  setCurrentUser: (user: User) => void;
  setCursors: (cursors: UserCursor[]) => void;
  setRoomId: (roomId: string) => void;
  setUsers: (users: User[]) => void;
}

export const useRoomStore = create<UseRoomStore>((set, get) => ({
  currentUser: null,
  setCurrentUser: (user) => set({ currentUser: user }),

  roomId: null,
  setRoomId: (roomId) => set({ roomId }),

  users: [],
  setUsers: (users) => set({ users }),

  cursors: [],
  setCursors: (cursors) => set({ cursors }),

  activityNodes: [],

  activateNode: (nodeId) => {
    const user = get().currentUser;
    if (!user) return;

    set((state) => {
      const existing = state.activityNodes.find((n) => n.id === nodeId);
      if (existing) {
        const already = existing.users.find((u) => u.id === user.id);
        if (!already) existing.users.push(user);
        return { activityNodes: [...state.activityNodes] };
      }
      return {
        activityNodes: [...state.activityNodes, { id: nodeId, users: [user], activityInputs: [] }]
      };
    });
  },

  activateNodeInput: (nodeId, inputName) => {
    const user = get().currentUser;
    if (!user) return;

    set((state) => {
      const node = state.activityNodes.find((n) => n.id === nodeId);
      if (!node) return state;

      const input = node.activityInputs.find((i) => i.inputName === inputName);
      if (input) {
        const already = input.users.find((u) => u.id === user.id);
        if (!already) input.users.push(user);
      } else {
        node.activityInputs.push({ inputName, users: [user] });
      }

      return { activityNodes: [...state.activityNodes] };
    });
  },

  diactivateNode: (nodeId) => {
    const userId = get().currentUser?.id;
    if (!userId) return;

    set((state) => ({
      activityNodes: state.activityNodes
        .map((n) =>
          n.id === nodeId
            ? {
                ...n,
                users: n.users.filter((u) => u.id !== userId),
                activityInputs: n.activityInputs.map((i) => ({
                  ...i,
                  users: i.users.filter((u) => u.id !== userId)
                }))
              }
            : n
        )
        .filter((n) => n.users.length > 0 || n.activityInputs.length > 0)
    }));
  },

  diactivateNodeInput: (nodeId, inputName) => {
    const userId = get().currentUser?.id;
    if (!userId) return;

    set((state) => ({
      activityNodes: state.activityNodes.map((n) =>
        n.id === nodeId
          ? {
              ...n,
              activityInputs: n.activityInputs
                .map((i) =>
                  i.inputName === inputName
                    ? { ...i, users: i.users.filter((u) => u.id !== userId) }
                    : i
                )
                .filter((i) => i.users.length > 0)
            }
          : n
      )
    }));
  }
}));

import { create } from "zustand";

import type { User, UserCursor } from "../types";

interface UseRoomStore {
  cursors: UserCursor[];
  roomId: string | null;
  users: User[];
  setCursors: (cursors: UserCursor[]) => void;
  setRoomId: (roomId: string) => void;
  setUsers: (users: User[]) => void;
}

export const useRoomStore = create<UseRoomStore>((set) => ({
  roomId: null,
  users: [],
  cursors: [],
  setCursors: (cursors) => set({ cursors }),
  setRoomId: (roomId) => set({ roomId }),
  setUsers: (users) => set({ users }),
}));

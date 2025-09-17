import { create } from 'zustand';

interface UseRoomStore {
  room: string | null;
  setRoom: (room: string) => void;
}

export const useRoomStore = create<UseRoomStore>((set) => ({
  room: null,
  setRoom: (room) => set({ room })
}));

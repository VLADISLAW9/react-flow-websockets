import { useCursorsStore } from '@/utils/stores';

export const handleCursorMoved = (data: any) => {
  const { cursors, setCursors } = useCursorsStore.getState();

  setCursors(cursors.map((cursor) => (cursor.userId === data.userId ? data : cursor)));
};

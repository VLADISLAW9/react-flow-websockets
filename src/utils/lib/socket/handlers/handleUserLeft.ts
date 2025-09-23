import { useCursorsStore, useUsersStore } from '@/utils/stores';

export const handleUserLeft = (data: any) => {
  const { setUsers, users } = useUsersStore.getState();
  const { cursors, setCursors } = useCursorsStore.getState();

  setUsers(users.filter((user) => user.id !== data.payload.userId));
  setCursors(cursors.filter((cursor) => cursor.userId !== data.payload.userId));
};

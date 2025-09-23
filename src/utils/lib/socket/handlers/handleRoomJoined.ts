import { useCursorsStore, useProfileStore, useRoomStore, useUsersStore } from '@/utils/stores';
import type { User } from '@/utils/types';
import { reactFlow } from '../../reactFlow/instance';

export const handleRoomJoined = (data: any) => {
  const { setProfile } = useProfileStore.getState();
  const { setUsers } = useUsersStore.getState();
  const { setRoom } = useRoomStore.getState();
  const { setCursors } = useCursorsStore.getState();

  const currentUser = data.currentUser as User;
  const users = data.users as User[];

  setProfile(currentUser);
  setRoom('1');
  setUsers(users);

  reactFlow.setNodes(data.flowState.nodes);
  reactFlow.setEdges(data.flowState.edges);

  setCursors(
    users
      .filter((user) => user.id !== currentUser.id)
      .map((user: User) => ({
        userId: user.id,
        position: { x: 0, y: 0 },
        color: user.color,
        name: user.name,
        lastUpdated: Date.now()
      }))
  );
};

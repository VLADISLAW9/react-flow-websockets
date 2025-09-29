import type { Member } from '@/utils/types';

import { useProfileStore, useRoomStore } from '@/utils/stores';

import { canvas } from '../../canvas/instance';
import { members } from '../../members/instance';

export const handleRoomJoined = (data: any) => {
  const { setProfile } = useProfileStore.getState();
  const { setRoom } = useRoomStore.getState();

  const currentUser = data.currentUser as Member;
  const users = data.users as Member[];

  setProfile(currentUser);
  setRoom('1');

  members.setMembers(users);

  canvas.setNodes(data.flowState.nodes);
  canvas.setEdges(data.flowState.edges);

  members.setCursors(
    users
      .filter((user) => user.id !== currentUser.id)
      .map((user: Member) => ({
        userId: user.id,
        position: { x: 0, y: 0 },
        color: user.color,
        name: user.name,
        lastUpdated: Date.now()
      }))
  );
};

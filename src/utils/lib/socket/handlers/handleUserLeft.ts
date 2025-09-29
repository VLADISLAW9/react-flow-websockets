import { members } from '../../members/instance';

export const handleUserLeft = (data: any) => {
  const users = members.getMembers();
  const cursors = members.getCursors();

  members.setMembers(users.filter((user) => user.id !== data.payload.userId));
  members.setCursors(cursors.filter((cursor) => cursor.userId !== data.payload.userId));
};

import { members } from '../../members/instance';

export const handleCursorMoved = (data: any) => {
  const cursors = members.getCursors();
  members.setCursors(cursors.map((cursor) => (cursor.userId === data.userId ? data : cursor)));
};

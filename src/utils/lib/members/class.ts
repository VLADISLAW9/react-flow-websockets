import type { Cursor, Member } from '@/utils/types';

import { useCursorsStore, useMembersStore } from '@/utils/stores';

export class Members {
  public getMembers() {
    return useMembersStore.getState().members;
  }

  public getCursors() {
    return useCursorsStore.getState().cursors;
  }

  public setMembers(members: Member[]) {
    useMembersStore.getState().setMembers(members);
  }

  public setCursors(cursors: Cursor[]) {
    useCursorsStore.getState().setCursors(cursors);
  }

  public addMember(member: Member) {
    const members = useMembersStore.getState().members;
    useMembersStore.getState().setMembers([...members, member]);
  }

  public removeMember(memberId: string) {
    const members = useMembersStore.getState().members.filter((member) => member.id === memberId);
    useMembersStore.getState().setMembers(members);
  }
}

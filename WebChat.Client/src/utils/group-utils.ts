import { MemberRole } from "../enums/MemberRole";
import Group, { GroupMember } from "../types/Group";
import { storage } from "./storage-management";

export default class GroupUtils {
  static isAdmin(role?: MemberRole | null) {
    return role === MemberRole.Leader || role === MemberRole.DeputyGroup;
  }
  static getMember(group: Group, userId?: string | null): GroupMember | null {
    const memberId = userId || storage.getUserId();
    if (!memberId) return null;
    const member = group.members.find((m) => m.userId === memberId);
    return member || null;
  }
  static includes(group: Group, userId?: string | null): boolean {
    const memberId = userId || storage.getUserId();
    if (!memberId) return false;
    return (
      group.joinRequests.some((r) => r.userId === memberId) ||
      group.members.some((m) => m.userId === memberId) ||
      group.joinInvitations.some((i) => i.userId === memberId)
    );
  }
}

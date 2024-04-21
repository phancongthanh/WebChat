import { MemberRole } from "../enums/MemberRole";

export interface JoinInvitation {
  groupId: string;
  userId: string;
  memberId: string;
  sendTime: Date;
}

export interface JoinRequest {
  groupId: string;
  userId: string;
  sendTime: Date;
}

export interface GroupMember {
  groupId: string;
  userId: string;
  role: MemberRole;
  joinDate: Date;
  joinBy?: string | null;
}

export interface GroupSetting {
  allowChangeGName: boolean;
  allowSendGInvitation: boolean;
  membershipApproval: boolean;
  readRecentMessage: boolean;
  joinGroupByLink: boolean;
  groupCode: string;
}

export default interface Group {
  groupId: string;
  avatar: boolean;
  name: string;
  numberOfMembers: number;
  joinRequests: Array<JoinRequest>;
  joinInvitations: Array<JoinInvitation>;
  members: Array<GroupMember>;
  setting: GroupSetting;
  conversationId: string;
}

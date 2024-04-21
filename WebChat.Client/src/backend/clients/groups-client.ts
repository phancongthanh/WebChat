import { MemberRole } from "../../enums/MemberRole";
import Group, { GroupSetting } from "../../types/Group";
import { Group as GroupDto, GroupsApiInterface } from "../openapi";

export default class GroupsClient {
  groups: GroupsApiInterface;
  constructor(groups: GroupsApiInterface) {
    this.groups = groups;
  }

  static convertGroup(dto: GroupDto): Group {
    return {
      groupId: dto.groupId,
      avatar: Boolean(dto.avatarPath),
      name: dto.name,
      numberOfMembers: dto.numberOfMembers,
      joinRequests: dto.joinRequests.map((r) => ({
        groupId: r.groupId,
        userId: r.userId,
        sendTime: new Date(r.sendTime),
      })),
      joinInvitations: dto.joinInvitations.map((i) => ({
        groupId: i.groupId,
        userId: i.userId,
        memberId: i.memberId,
        sendTime: new Date(i.sendTime),
      })),
      members: dto.members.map((m) => ({
        groupId: m.groupId,
        userId: m.userId,
        role: m.role,
        joinBy: m.joinBy,
        joinDate: new Date(m.joinDate),
      })),
      setting: dto.setting,
      conversationId: dto.conversationId,
    };
  }

  async getList(): Promise<Group[]> {
    const response = await this.groups.apiGroupsGet();
    const dtos = response.data;
    if (!dtos) return [];

    const groups = dtos.map((dto) => GroupsClient.convertGroup(dto));
    return groups;
  }

  async get(groupId: string): Promise<Group | null> {
    const response = await this.groups.apiGroupsGroupIdGet(groupId);
    const dto = response.data;
    if (!dto) return null;
    const group = GroupsClient.convertGroup(dto);
    return group;
  }

  async getByCode(code: string): Promise<Group | null> {
    const response = await this.groups.apiGroupsCodeGet(code);
    const dto = response.data;
    if (!dto) return null;

    const group = GroupsClient.convertGroup(dto);
    return group;
  }

  async create(name: string, userIds: string[]): Promise<string> {
    const response = await this.groups.apiGroupsPost(name, userIds);
    const groupId = response.data;
    return groupId;
  }

  async updateSetting(groupId: string, setting: GroupSetting): Promise<void> {
    await this.groups.apiGroupsGroupIdSettingPut(groupId, setting);
  }

  async updateName(groupId: string, name: string): Promise<void> {
    await this.groups.apiGroupsGroupIdNamePatch(groupId, name);
  }

  async remove(groupId: string): Promise<void> {
    await this.groups.apiGroupsGroupIdDelete(groupId);
  }

  async join(groupId: string): Promise<void> {
    await this.groups.apiGroupsGroupIdMemberPost(groupId);
  }
  async updateMemberRole(groupId: string, userId: string, role: MemberRole): Promise<void> {
    await this.groups.apiGroupsGroupIdMemberUserIdRolePatch(groupId, userId, role);
  }
  async leave(groupId: string, userId: string): Promise<void> {
    await this.groups.apiGroupsGroupIdMemberUserIdDelete(groupId, userId);
  }

  async sendRequest(groupId: string): Promise<void> {
    await this.groups.apiGroupsGroupIdRequestPost(groupId);
  }
  async acceptRequest(groupId: string, userId: string): Promise<void> {
    await this.groups.apiGroupsGroupIdRequestUserIdPut(groupId, userId);
  }
  async rejectRequest(groupId: string, userId: string): Promise<void> {
    await this.groups.apiGroupsGroupIdRequestUserIdDelete(groupId, userId);
  }

  async sendInvitation(groupId: string, userIds: string[]): Promise<void> {
    await this.groups.apiGroupsGroupIdInvitationPost(groupId, userIds);
  }
  async acceptInvitation(groupId: string, userId: string): Promise<void> {
    await this.groups.apiGroupsGroupIdInvitationUserIdPut(groupId, userId);
  }
  async rejectInvitation(groupId: string, userId: string): Promise<void> {
    await this.groups.apiGroupsGroupIdInvitationUserIdDelete(groupId, userId);
  }
}

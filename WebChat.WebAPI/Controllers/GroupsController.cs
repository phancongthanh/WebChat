using Microsoft.AspNetCore.Mvc;
using WebChat.Application.Common.Interfaces;
using WebChat.Application.Groups.Commands.AcceptGroup;
using WebChat.Application.Groups.Commands.CreateGroup;
using WebChat.Application.Groups.Commands.DeleteGroup;
using WebChat.Application.Groups.Commands.JoinGroup;
using WebChat.Application.Groups.Commands.KickMember;
using WebChat.Application.Groups.Commands.LeaveGroup;
using WebChat.Application.Groups.Commands.RejectGroup;
using WebChat.Application.Groups.Commands.SendGroupInvitation;
using WebChat.Application.Groups.Commands.SendGroupRequest;
using WebChat.Application.Groups.Commands.UpdateGroupName;
using WebChat.Application.Groups.Commands.UpdateGroupSetting;
using WebChat.Application.Groups.Commands.UpdateMemberRole;
using WebChat.Application.Groups.Queries.GetGroupByCode;
using WebChat.Application.Groups.Queries.GetGroupById;
using WebChat.Application.Groups.Queries.GetGroupsOfUser;
using WebChat.Domain.Entities;
using WebChat.Domain.Enums;

namespace WebChat.WebAPI.Controllers;

public class GroupsController(IUser user) : ApiControllerBase
{
    #region Read Group
    [HttpGet]
    public async Task<IEnumerable<Group>> GetGroups(CancellationToken cancellationToken = default)
    {
        var currentUserId = user.GetId();
        var query = new GetGroupsOfUserQuery() { CurrentUserId = currentUserId };
        var groups = await Mediator.Send(query, cancellationToken);
        return groups;
    }

    [HttpGet("{groupId}")]
    public async Task<Group> GetGroup([FromRoute] Guid groupId, CancellationToken cancellationToken = default)
    {
        var query = new GetGroupByIdQuery() { GroupId = groupId };
        var group = await Mediator.Send(query, cancellationToken);
        return group;
    }

    [HttpGet("Code")]
    public async Task<Group> GetGroupByCode([FromQuery] string code, CancellationToken cancellationToken = default)
    {
        var query = new GetGroupByCodeQuery() { GroupCode = code };
        var group = await Mediator.Send(query, cancellationToken);
        return group;
    }
    #endregion

    #region Write Group
    [HttpPost]
    public async Task<Guid> CreateGroup([FromQuery] string groupName, [FromBody] IEnumerable<Guid> userIds, CancellationToken cancellationToken = default)
    {
        var currentUserId = user.GetId();
        var command = new CreateGroupCommand()
        {
            CurrentUserId = currentUserId,
            GroupName = groupName,
            MemberIds = userIds
        };
        var groupId = await Mediator.Send(command, cancellationToken);
        return groupId;
    }

    [HttpPut("{groupId}/Setting")]
    public async Task UpdateGroupSetting([FromRoute] Guid groupId, [FromBody] GroupSetting setting, CancellationToken cancellationToken = default)
    {
        var currentUserId = user.GetId();
        var command = new UpdateGroupSettingCommand()
        {
            CurrentUserId = currentUserId,
            GroupId = groupId,
            Setting = setting
        };
        await Mediator.Send(command, cancellationToken);
    }

    [HttpPatch("{groupId}/Name")]
    public async Task UpdateGroupName([FromRoute] Guid groupId, [FromBody] string name, CancellationToken cancellationToken = default)
    {
        var currentUserId = user.GetId();
        var command = new UpdateGroupNameCommand()
        {
            CurrentUserId = currentUserId,
            GroupId = groupId,
            GroupName = name,
        };
        await Mediator.Send(command, cancellationToken);
    }

    [HttpDelete("{groupId}")]
    public async Task DeleteGroup([FromRoute] Guid groupId, CancellationToken cancellationToken = default)
    {
        var currentUserId = user.GetId();
        var command = new DeleteGroupCommand()
        {
            CurrentUserId = currentUserId,
            GroupId = groupId
        };
        await Mediator.Send(command, cancellationToken);
    }
    #endregion

    #region Member
    [HttpPost("{groupId}/Member")]
    public async Task JoinGroup([FromRoute] Guid groupId, CancellationToken cancellationToken = default)
    {
        var currentUserId = user.GetId();

        var command = new JoinGroupCommand()
        {
            CurrentUserId = currentUserId,
            GroupId = groupId
        };
        await Mediator.Send(command, cancellationToken);
    }

    [HttpPatch("{groupId}/Member/{userId}/Role")]
    public async Task UpdateMemberRole([FromRoute] Guid groupId, [FromRoute] Guid userId, [FromQuery] MemberRole role, CancellationToken cancellationToken = default)
    {
        var currentUserId = user.GetId();

        var command = new UpdateMemberRoleCommand()
        {
            GroupId = groupId,
            CurrentUserId = currentUserId,
            UserId = userId,
            Role = role
        };
        await Mediator.Send(command, cancellationToken);
    }

    [HttpDelete("{groupId}/Member/{userId}")]
    public async Task LeaveGroup([FromRoute] Guid groupId, [FromRoute] Guid userId, CancellationToken cancellationToken = default)
    {
        var currentUserId = user.GetId();
        if (currentUserId == userId)
        {
            var command = new LeaveGroupCommand()
            {
                GroupId = groupId,
                CurrentUserId = currentUserId
            };
            await Mediator.Send(command, cancellationToken);
        }
        else
        {
            var command = new KickMemberCommand()
            {
                GroupId = groupId,
                CurrentUserId = currentUserId,
                UserId = userId
            };
            await Mediator.Send(command, cancellationToken);
        }
    }
    #endregion

    #region Request
    [HttpPost("{groupId}/Request")]
    public async Task SendGroupRequest([FromRoute] Guid groupId, CancellationToken cancellationToken = default)
    {
        var currentUserId = user.GetId();
        var command = new SendGroupRequestCommand()
        {
            CurrentUserId = currentUserId,
            GroupId = groupId
        };
        await Mediator.Send(command, cancellationToken);
    }

    [HttpPut("{groupId}/Request/{userId}")]
    public async Task AcceptGroupRequest([FromRoute] Guid groupId, [FromRoute] Guid userId, CancellationToken cancellationToken = default)
    {
        var currentUserId = user.GetId();
        var command = new AcceptGroupCommand()
        {
            GroupId = groupId,
            CurrentUserId = currentUserId,
            UserId = userId
        };
        await Mediator.Send(command, cancellationToken);
    }

    [HttpDelete("{groupId}/Request/{userId}")]
    public async Task RejectGroupRequest([FromRoute] Guid groupId, [FromRoute] Guid userId, CancellationToken cancellationToken = default)
    {
        var currentUserId = user.GetId();
        var command = new RejectGroupCommand()
        {
            GroupId = groupId,
            CurrentUserId = currentUserId,
            UserId = userId
        };
        await Mediator.Send(command, cancellationToken);
    }
    #endregion

    #region Invitation
    [HttpPost("{groupId}/Invitation")]
    public async Task SendGroupInvitation([FromRoute] Guid groupId, [FromBody] IEnumerable<Guid> userIds, CancellationToken cancellationToken = default)
    {
        var currentUserId = user.GetId();
        var command = new SendGroupInvitationCommand()
        {
            GroupId = groupId,
            CurrentUserId = currentUserId,
            UserIds = userIds
        };
        await Mediator.Send(command, cancellationToken);
    }
    [HttpPut("{groupId}/Invitation/{userId}")]
    public async Task AcceptGroupInvitation([FromRoute] Guid groupId, [FromRoute] Guid userId, CancellationToken cancellationToken = default)
    {
        var currentUserId = user.GetId();
        var command = new AcceptGroupCommand()
        {
            GroupId = groupId,
            CurrentUserId = currentUserId,
            UserId = userId
        };
        await Mediator.Send(command, cancellationToken);
    }

    [HttpDelete("{groupId}/Invitation/{userId}")]
    public async Task RejectGroupInvitation([FromRoute] Guid groupId, [FromRoute] Guid userId, CancellationToken cancellationToken = default)
    {
        var currentUserId = user.GetId();
        var command = new RejectGroupCommand()
        {
            GroupId = groupId,
            CurrentUserId = currentUserId,
            UserId = userId
        };
        await Mediator.Send(command, cancellationToken);
    }
    #endregion
}

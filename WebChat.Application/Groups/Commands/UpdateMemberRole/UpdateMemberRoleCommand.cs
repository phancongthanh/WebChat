
using WebChat.Domain.Events.Conversations;
using WebChat.Domain.Events.Groups;

namespace WebChat.Application.Groups.Commands.UpdateMemberRole;

[Authorize]
public record UpdateMemberRoleCommand : IRequest, ICurrentUser
{
    public Guid GroupId { get; init; }
    public Guid CurrentUserId { get; init; }
    public Guid UserId { get; init; }
    public MemberRole Role { get; init; }
}

public class UpdateMemberRoleCommandHandler(
    IGroupRepository groupRepository,
    IConversationRepository conversationRepository,
    IUnitOfWork unitOfWork
    ) : IRequestHandler<UpdateMemberRoleCommand>
{
    public async Task Handle(UpdateMemberRoleCommand request, CancellationToken cancellationToken)
    {
        var group = await groupRepository.GetAsync(request.GroupId, cancellationToken);
        var member = group.Members
            .Where(m => m.UserId == request.UserId)
            .FirstOrDefault()
            ?? throw new NotFoundException($"GroupId: {request.GroupId}, UserId: {request.UserId}", nameof(GroupMember))
                .WithDetail(GroupResource.NotFoundMember)
                .WithCode(nameof(GroupResource.NotFoundMember));
        if (member.Role == request.Role) return;

        var admin = group.Members
            .Where(m => m.UserId == request.CurrentUserId)
            .FirstOrDefault()
            ?? throw new NotFoundException($"GroupId: {request.GroupId}, UserId: {request.UserId}", nameof(GroupMember))
                .WithDetail(GroupResource.IsNotMember)
                .WithCode(nameof(GroupResource.IsNotMember));

        // Domain validation
        if (!admin.Role.IsAdmin())
            throw new ForbiddenAccessException($"Current user is not admin")
                .WithDetail(GroupResource.IsNotAdmin)
                .WithCode(nameof(GroupResource.IsNotAdmin));

        if (admin.Role == MemberRole.DeputyGroup && member.Role.IsAdmin())
            throw new ForbiddenAccessException($"Only leader can change member role to {request.Role}")
                .WithDetail(GroupResource.IsNotLeader)
                .WithCode(nameof(GroupResource.IsNotLeader));

        // Update data
        var conversation = await conversationRepository.GetWithoutMessagesAsync(group.ConversationId, cancellationToken);
        var conversationMember = conversation.Members.Where(m => m.UserId == request.UserId).Single();
        try
        {
            await unitOfWork.BeginTransactionAsync(cancellationToken);

            // Update conversation member
            if (member.Role == MemberRole.IsBlock && request.Role != MemberRole.IsBlock)
            {
                conversationMember.IsBlock = false;
                conversation.AddDomainEvent(new ConversationMemberUpdatedEvent(conversationMember));
                await conversationRepository.UpdateMember(conversation, conversationMember.UserId, cancellationToken);
            }
            else if (member.Role != MemberRole.IsBlock && request.Role == MemberRole.IsBlock)
            {
                conversationMember.IsBlock = true;
                conversation.AddDomainEvent(new ConversationMemberUpdatedEvent(conversationMember));
                await conversationRepository.UpdateMember(conversation, conversationMember.UserId, cancellationToken);
            }

            // Update group
            if (request.Role == MemberRole.Leader) admin.Role = MemberRole.DeputyGroup;
            member.Role = request.Role;
            group.AddDomainEvent(new GroupUpdatedEvent(group));
            await groupRepository.UpdateAsync(group, cancellationToken);

            await unitOfWork.CommitTransactionAsync(cancellationToken);
        }
        catch (Exception)
        {
            await unitOfWork.RollbackTransactionAsync(cancellationToken);
            throw;
        }
    }
}

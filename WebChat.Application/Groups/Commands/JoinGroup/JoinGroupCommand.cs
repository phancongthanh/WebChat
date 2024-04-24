using WebChat.Domain.Events.Groups;

namespace WebChat.Application.Groups.Commands.JoinGroup;

[Authorize]
public record JoinGroupCommand : IRequest, ICurrentUser
{
    public Guid GroupId { get; init; }
    public Guid CurrentUserId { get; init; }
}

public class JoinGroupCommandHandler(IGroupRepository groupRepository, IConversationRepository conversationRepository, IUnitOfWork unitOfWork)
    : IRequestHandler<JoinGroupCommand>
{
    public async Task Handle(JoinGroupCommand request, CancellationToken cancellationToken)
    {
        var group = await groupRepository.GetAsync(request.GroupId, cancellationToken);
        if (group.Members.Any(m => m.UserId == request.CurrentUserId)) return;

        // Domain validation
        if (group.Setting.MembershipApproval || !group.Setting.JoinGroupByLink)
            throw new ForbiddenAccessException()
                .WithDetail(GroupResource.NotAllowJoinByLink)
                .WithCode(nameof(GroupResource.NotAllowJoinByLink));

        // Update data
        var joinRequest = group.JoinRequests.Where(r => r.UserId == request.CurrentUserId).FirstOrDefault();
        if (joinRequest != null) group.JoinRequests.Remove(joinRequest);
        var joinInvitation = group.JoinInvitations.Where(i => i.UserId == request.CurrentUserId).FirstOrDefault();
        if (joinInvitation != null) group.JoinInvitations.Remove(joinInvitation);
        var groupMember = new GroupMember()
        {
            GroupId = request.GroupId,
            UserId = request.CurrentUserId,
            Role = MemberRole.Member,
            JoinDate = DateTime.UtcNow,
        };
        group.Members.Add(groupMember);
        var conversation = await conversationRepository.GetWithLastMessagesAsync(group.ConversationId, cancellationToken);
        var lastMessage = conversation.Messages.SingleOrDefault();
        var conversationMember = new ConversationMember()
        {
            ConversationId = group.ConversationId,
            UserId = request.CurrentUserId,
            IsHidden = false,
            LoadFromId = !group.Setting.ReadRecentMessage && lastMessage != null ? lastMessage.MessageId : 0,
        };
        conversation.Members.Add(conversationMember);

        // Prepare domain event
        var domainEvent = new MemberJoinedEvent(group, request.CurrentUserId);
        group.AddDomainEvent(domainEvent);

        // Save data
        try
        {
            await unitOfWork.BeginTransactionAsync(cancellationToken);
            await groupRepository.UpdateAsync(group, cancellationToken);
            await conversationRepository.AddMember(conversation, request.CurrentUserId, cancellationToken);
            await unitOfWork.CommitTransactionAsync(cancellationToken);
        }
        catch (Exception)
        {
            await unitOfWork.RollbackTransactionAsync(cancellationToken);
            throw;
        }
    }
}

using WebChat.Domain.Events.Groups;

namespace WebChat.Application.Groups.Commands.AcceptGroup;

[Authorize]
public record AcceptGroupCommand : IRequest, ICurrentUser
{
    public Guid GroupId { get; init; }
    public Guid CurrentUserId { get; init; }
    public Guid UserId { get; init; }
}

public class AcceptGroupCommandHandler(IUnitOfWork unitOfWork, IGroupRepository groupRepository, IConversationRepository conversationRepository) : IRequestHandler<AcceptGroupCommand>
{
    public async Task Handle(AcceptGroupCommand request, CancellationToken cancellationToken)
    {
        var group = await groupRepository.GetAsync(request.GroupId, cancellationToken);
        var joinRequest = group.JoinRequests.SingleOrDefault(r => r.UserId == request.UserId);
        var joinInvitation = group.JoinInvitations.SingleOrDefault(i => i.UserId == request.UserId);

        // Domain validation
        if (request.CurrentUserId == request.UserId)
        {
            // User accept join invitation
            if (joinInvitation == null) throw new InvalidOperationException();
        } else
        {
            // Admin accept join request
            if (joinRequest == null) throw new InvalidOperationException();
        }

        // Update data
        if (joinRequest != null) group.JoinRequests.Remove(joinRequest);
        if (joinInvitation != null) group.JoinInvitations.Remove(joinInvitation);
        var groupMember = new GroupMember()
        {
            GroupId = request.GroupId,
            UserId = request.UserId,
            Role = MemberRole.Member,
            JoinDate = DateTime.UtcNow,
            JoinBy = joinInvitation?.MemberId.ToString(),
        };
        group.Members.Add(groupMember);
        var conversation = await conversationRepository.GetWithLastMessagesAsync(group.ConversationId, cancellationToken);
        var lastMessage = conversation.Messages.SingleOrDefault();
        var conversationMember = new ConversationMember()
        {
            ConversationId = group.ConversationId,
            UserId = request.UserId,
            IsHidden = false,
            LoadFromId = !group.Setting.ReadRecentMessage && lastMessage != null ? lastMessage.MessageId : 0,
        };
        conversation.Members.Add(conversationMember);

        // Prepare domain event
        var domainEvent = new MemberJoinedEvent(group, request.UserId);
        group.AddDomainEvent(domainEvent);

        // Save data
        try
        {
            await unitOfWork.BeginTransactionAsync(cancellationToken);
            await groupRepository.UpdateAsync(group, cancellationToken);
            await conversationRepository.AddMember(conversation, request.UserId, cancellationToken);
            await unitOfWork.CommitTransactionAsync(cancellationToken);
        }
        catch (Exception)
        {
            await unitOfWork.RollbackTransactionAsync(cancellationToken);
            throw;
        }
    }
}

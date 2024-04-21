using WebChat.Domain.Events.Groups;
using ValidationException = WebChat.Application.Common.Exceptions.ValidationException;

namespace WebChat.Application.Groups.Commands.LeaveGroup;

[Authorize]
public record LeaveGroupCommand : IRequest, ICurrentUser
{
    public Guid GroupId { get; init; }
    public Guid CurrentUserId { get; init; }
}

public class LeaveGroupCommandHandler(IGroupRepository groupRepository, IConversationRepository conversationRepository, IUnitOfWork unitOfWork) : IRequestHandler<LeaveGroupCommand>
{
    public async Task Handle(LeaveGroupCommand request, CancellationToken cancellationToken)
    {
        var group = await groupRepository.GetAsync(request.GroupId, cancellationToken);
        var member = group.Members.SingleOrDefault(m => m.UserId == request.CurrentUserId)
            ?? throw new ForbiddenAccessException(GroupResource.IsNotMember);
        if (member.Role == MemberRole.Leader && group.Members.Where(m => m.Role == MemberRole.Leader).Count() <= 1)
            throw new ValidationException(GroupResource.Member, GroupResource.LeaderCantLeave);
        var conversation = await conversationRepository.GetAsync(group.ConversationId, cancellationToken);
        var conversationMember = conversation.Members.SingleOrDefault(m => m.UserId == request.CurrentUserId);

        // Update data
        group.Members.Remove(member);
        if (conversationMember != null) conversation.Members.Remove(conversationMember);

        // Prepare domain event
        var domainEvent = new MemberLeavedEvent(group, member);
        group.AddDomainEvent(domainEvent);

        // Save data
        try
        {
            await unitOfWork.BeginTransactionAsync(cancellationToken);
            if (conversationMember != null)
                await conversationRepository.DeleteMember(conversation, conversationMember, cancellationToken);
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

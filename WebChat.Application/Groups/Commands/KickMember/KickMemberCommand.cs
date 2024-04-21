using WebChat.Domain.Events.Groups;

namespace WebChat.Application.Groups.Commands.KickMember;

[Authorize]
public record KickMemberCommand : IRequest, ICurrentUser
{
    public Guid GroupId { get; init; }
    public Guid CurrentUserId { get; init; }
    public Guid UserId { get; init; }
}

public class KickMemberCommandHandler(IUnitOfWork unitOfWork, IGroupRepository groupRepository, IConversationRepository conversationRepository) : IRequestHandler<KickMemberCommand>
{
    public async Task Handle(KickMemberCommand request, CancellationToken cancellationToken)
    {
        var group = await groupRepository.GetAsync(request.GroupId, cancellationToken: cancellationToken);
        var admin = group.Members.SingleOrDefault(m => m.UserId == request.CurrentUserId);
        var member = group.Members.SingleOrDefault(m => m.UserId == request.UserId);
        if (member == null) return;

        // Domain validation
        if (admin == null)
            throw new ForbiddenAccessException(GroupResource.IsNotMember);
        else if (!admin.Role.IsAdmin())
            throw new ForbiddenAccessException(GroupResource.IsNotAdmin);

        // Update data
        var conversation = await conversationRepository.GetAsync(group.ConversationId, cancellationToken);
        var conversationMember = conversation.Members.SingleOrDefault(m => m.UserId == request.UserId);
        group.Members.Remove(member);
        if (conversationMember != null) conversation.Members.Remove(conversationMember);

        // Prepare domain event
        var domainEvent = new MemberLeavedEvent(group, member);
        group.AddDomainEvent(domainEvent);

        // Save data
        try
        {
            await unitOfWork.BeginTransactionAsync(cancellationToken);
            await groupRepository.UpdateAsync(group, cancellationToken);
            if (conversationMember != null)
                await conversationRepository.DeleteMember(conversation, conversationMember, cancellationToken);
            await unitOfWork.CommitTransactionAsync(cancellationToken);
        }
        catch (Exception)
        {
            await unitOfWork.RollbackTransactionAsync(cancellationToken);
            throw;
        }
    }
}

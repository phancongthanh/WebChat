using WebChat.Domain.Events.Groups;

namespace WebChat.Application.Groups.Commands.DeleteGroup;

[Authorize]
public record DeleteGroupCommand : IRequest, ICurrentUser
{
    public Guid GroupId { get; init; }
    public Guid CurrentUserId {  get; init; }
}

public class DeleteGroupCommandHandler(
    IGroupRepository groupRepository,
    IConversationRepository conversationRepository,
    IUnitOfWork unitOfWork)
    : IRequestHandler<DeleteGroupCommand>
{
    public async Task Handle(DeleteGroupCommand request, CancellationToken cancellationToken)
    {
        // Domain validation
        var group = await groupRepository.GetAsync(request.GroupId, cancellationToken: cancellationToken);
        var member = group.Members.SingleOrDefault(m => m.UserId == request.CurrentUserId);
        if (member == null)
            throw new ForbiddenAccessException(GroupResource.IsNotMember);
        else if (!member.Role.IsAdmin())
            throw new ForbiddenAccessException(GroupResource.IsNotAdmin);

        // Delete group
        group.AddDomainEvent(new GroupDeletedEvent(group));

        // Delete messages of group's conversation
        

        // Delete conversation of the group
        var conversation = await conversationRepository
            .GetWithoutMessagesAsync(group.ConversationId, cancellationToken: cancellationToken);
        
        // Delete
        try
        {
            await unitOfWork.BeginTransactionAsync(cancellationToken);
            await groupRepository.DeleteAsync(group, cancellationToken);
            await conversationRepository.DeleteAsync(conversation, cancellationToken);
            await unitOfWork.CommitTransactionAsync(cancellationToken);
        }
        catch (Exception)
        {
            await unitOfWork.RollbackTransactionAsync(cancellationToken);
            throw;
        }
    }
}

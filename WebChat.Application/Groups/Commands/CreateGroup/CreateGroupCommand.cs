using WebChat.Domain.Events.Groups;

namespace WebChat.Application.Groups.Commands.CreateGroup;

[Authorize]
public record CreateGroupCommand : IRequest<Guid>, ICurrentUser
{
    public Guid CurrentUserId { get; init; }
    public required string GroupName { get; init; }
    public required IEnumerable<Guid> MemberIds { get; init; }
}

public class CreateGroupCommandHandler(
    IFriendRepository friendRepository,
    IGroupRepository groupRepository,
    IConversationRepository conversationRepository,
    IUnitOfWork unitOfWork)
        : IRequestHandler<CreateGroupCommand, Guid>
{
    public async Task<Guid> Handle(CreateGroupCommand request, CancellationToken cancellationToken)
    {
        var memberIds = request.MemberIds.Where(userId => userId != request.CurrentUserId);
        var friendships = await friendRepository
            .GetListOfUserAsync(request.CurrentUserId, cancellationToken);

        // Domain validation
        foreach (var memberId in memberIds)
        {
            // The member must be friend with the current user
            var friendship = friendships.SingleOrDefault(f => f.FriendId == memberId);
            Guard.Against.InvalidInput(
                friendship, 
                GroupResource.Member, 
                f => f?.IsFriend == true,
                GroupResource.MemberIsNotFriend);
        }

        // Create group conversation
        var conversationId = Guid.NewGuid();
        var conversation = new Conversation()
        {
            Type = ConversationType.Group,
            ConversationId = conversationId
        };
        conversation.Members.Add(new ConversationMember() { UserId = request.CurrentUserId });
        foreach (var memberId in memberIds)
            conversation.Members.Add(new ConversationMember() { UserId = memberId });
        // Create group
        var groupId = Guid.NewGuid();
        var group = new Group()
        {
            GroupId = groupId,
            Name = request.GroupName,
            ConversationId = conversationId
        };
        group.Setting.GroupCode = GenerateCode();
        group.Members.Add(new GroupMember() { Role = MemberRole.Leader, UserId = request.CurrentUserId });
        foreach (var memberId in memberIds)
            group.Members.Add(new GroupMember() { Role = MemberRole.Member, UserId = memberId });
        // Preparing domain event
        var domainEvent = new GroupCreatedEvent(group);
        group.AddDomainEvent(domainEvent);

        // Save data
        try
        {
            await unitOfWork.BeginTransactionAsync(cancellationToken);
            await conversationRepository.AddAsync(conversation, cancellationToken);
            await groupRepository.AddAsync(group, cancellationToken);
            await unitOfWork.CommitTransactionAsync(cancellationToken);

            return groupId;
        }
        catch (Exception)
        {
            await unitOfWork.RollbackTransactionAsync(cancellationToken);
            throw;
        }
    }

    protected static string GenerateCode()
    {
        const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        var random = new Random();
        return new string(Enumerable.Repeat(chars, 8)
            .Select(s => s[random.Next(s.Length)]).ToArray());
    }
}

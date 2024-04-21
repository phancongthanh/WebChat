namespace WebChat.Application.Friendships.Commands.StartFriendship;

[Authorize]
public record StartFriendshipCommand : IRequest, ICurrentUser
{
    public Guid CurrentUserId { get; init; }
    public Guid FriendId { get; init; }
}


public class StartFriendshipCommandHandler(
    IUserRepository userRepository,
    IFriendRepository friendRepository,
    IConversationRepository conversationRepository,
    IUnitOfWork unitOfWork)
    : IRequestHandler<StartFriendshipCommand>
{
    public async Task Handle(StartFriendshipCommand request, CancellationToken cancellationToken)
    {
        var existingFriendship = await friendRepository
            .FindAsync(request.CurrentUserId, request.FriendId, cancellationToken);

        if (existingFriendship != null) return;

        // Domain validation
        var users = await userRepository.GetListAsync([request.CurrentUserId, request.FriendId], cancellationToken);
        var user = users.SingleOrDefault(u => u.UserId == request.CurrentUserId);
        Guard.Against.NotFound(request.CurrentUserId, user, UserResource.User);
        var friend = users.SingleOrDefault(u => u.UserId == request.CurrentUserId);
        Guard.Against.NotFound(request.FriendId, friend, UserResource.User);

        // Create friend conversation
        var conversation = new Conversation()
        {
            Type = ConversationType.Friend,
            ConversationId = Guid.NewGuid()
        };
        conversation.Members.Add(new ConversationMember() { UserId = request.CurrentUserId });
        conversation.Members.Add(new ConversationMember() { UserId = request.FriendId });


        // Create friendship
        var friendships = new[] {
            new Friendship()
            {
                UserId = request.CurrentUserId,
                FriendId = request.FriendId,
                ConversationId = conversation.ConversationId
            },
            new Friendship()
            {
                UserId = request.FriendId,
                FriendId = request.CurrentUserId,
                ConversationId = conversation.ConversationId
            }
        };

        // Preparing domain event
        var domainEvent = new FriendshipStartedEvent(request.CurrentUserId, request.FriendId);
        friendships[0].AddDomainEvent(domainEvent);

        // Save data
        try
        {
            await unitOfWork.BeginTransactionAsync(cancellationToken);
            await conversationRepository.AddAsync(conversation, cancellationToken);
            foreach (var friendship in friendships)
                await friendRepository.AddAsync(friendship, cancellationToken);
            await unitOfWork.CommitTransactionAsync(cancellationToken);
        }
        catch (Exception)
        {
            await unitOfWork.RollbackTransactionAsync(cancellationToken);
            throw;
        }
    }
}

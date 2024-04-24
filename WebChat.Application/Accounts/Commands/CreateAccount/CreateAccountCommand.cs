namespace WebChat.Application.Accounts.Commands.CreateAccount;

public record CreateAccountCommand : IRequest
{
    public string CountryCode { get; init; } = string.Empty;

    public string PhoneNumber { get; init; } = string.Empty;

    public string Name { get; init; } = string.Empty;

    public DateTimeOffset Birthday { get; init; }

    public Gender Gender { get; init; }

    public string Password { get; init; } = string.Empty;
}

public class CreateAccountCommandHandler(IUnitOfWork unitOfWork,
    IUserRepository userRepository,
    IConversationRepository conversationRepository,
    IIdentityService identityService)
    : IRequestHandler<CreateAccountCommand>
{
    public async Task Handle(CreateAccountCommand request, CancellationToken cancellationToken)
    {
        // Preparing data
        var phone = PhoneNumber.From(request.CountryCode, request.PhoneNumber);
        var existedUser = await userRepository.FindByPhoneAsync(phone, cancellationToken);

        // Domain validate
        if (existedUser != null)
            throw new ConflictException(UserResource.User, phone.ToString())
                .WithDetail(UserResource.UserAlreadyExists)
                .WithCode(nameof(UserResource.UserAlreadyExists));
        
        // Create account
        var userId = await identityService.CreateUserAsync(phone.ToString(), request.Password);

        // Create cloud conversation
        var conversationId = Guid.NewGuid();
        var conversation = new Conversation()
        {
            Type = ConversationType.Cloud,
            ConversationId = conversationId
        };
        var member = new ConversationMember()
        {
            ConversationId = conversationId,
            UserId = userId
        };

        // Create user
        var user = new User()
        {
            UserId = userId,
            Name = request.Name,
            Birthday = request.Birthday.UtcDateTime,
            Gender = request.Gender,
            PhoneNumber = PhoneNumber.From(request.CountryCode, request.PhoneNumber),
            ConversationId = conversationId,
        };

        // Save data
        try
        {
            await unitOfWork.BeginTransactionAsync(cancellationToken);
            await conversationRepository.AddAsync(conversation, cancellationToken);
            await userRepository.AddAsync(user, cancellationToken);
            conversation.Members.Add(member);
            await conversationRepository.AddMember(conversation, member.UserId, cancellationToken);
            await unitOfWork.CommitTransactionAsync(cancellationToken);
        }
        catch (Exception)
        {
            await unitOfWork.RollbackTransactionAsync(cancellationToken);
            await identityService.DeleteUserAsync(userId);
            throw;
        }
    }
}

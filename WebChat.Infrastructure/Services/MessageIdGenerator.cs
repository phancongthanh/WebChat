using WebChat.Domain.Interfaces;
using WebChat.Persistence.Contexts;

namespace WebChat.Infrastructure.Services;
internal class MessageIdGenerator(IApplicationDbContext context) : IMessageIdGenerator
{
    public long GenerateMessageId() => context.Messages.Select(m => m.MessageId).DefaultIfEmpty().Max() + 1;
}

namespace WebChat.Domain.Exceptions;
public class InvalidPhoneNumberException(string countryCode, string subscriberNumber)
    : Exception($"Phone number: (+{countryCode}){subscriberNumber} is not valid.")
{
    public string CountryCode { get; } = countryCode;
    public string SubscriberNumber { get; } = subscriberNumber;
}

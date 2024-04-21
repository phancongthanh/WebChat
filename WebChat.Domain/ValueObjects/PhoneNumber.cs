namespace WebChat.Domain.ValueObjects;

public class PhoneNumber : ValueObject
{
    // Khai báo các thuộc tính của class
    public string CountryCode { get; private set; } // Mã quốc gia
    public string SubscriberNumber { get; private set; } // Số thuê bao

    // Khởi tạo class PhoneNumber từ một chuỗi số điện thoại
    private PhoneNumber(string countryCode, string subscriberNumber)
    {
        CountryCode = countryCode;
        SubscriberNumber = subscriberNumber;
    }

    public readonly static PhoneNumber Empty = new("", "");
    public static bool IsNullOrEmpty(PhoneNumber? phoneNumber)
        => phoneNumber == null || phoneNumber == Empty;

    public static PhoneNumber From(string countryCode, string subscriberNumber)
    {
        // Validate số điện thoại
        if (string.IsNullOrEmpty(countryCode)
            || string.IsNullOrEmpty(subscriberNumber)
            || !countryCode.All(char.IsDigit)
            || !subscriberNumber.All(char.IsDigit)
            || countryCode.Length > 3
            || subscriberNumber.Length < 7
            || subscriberNumber.Length > 15)
            throw new InvalidPhoneNumberException(countryCode, subscriberNumber);
        var country = int.Parse(countryCode);
        var phone = int.Parse(subscriberNumber);
        return new PhoneNumber(country.ToString(), phone.ToString());
    }

    protected override IEnumerable<object> GetEqualityComponents() => new[] { CountryCode, SubscriberNumber };

    public override string ToString()
    {
        return "(+" + CountryCode + ')' + SubscriberNumber;
    }
}

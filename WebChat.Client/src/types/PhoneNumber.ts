export class PhoneNumber {
  countryCode: number;
  subcriberNumber: number;

  constructor(countryCode: number | string, subcriberNumber: number | string) {
    this.countryCode = Number(countryCode);
    this.subcriberNumber = Number(subcriberNumber);
  }

  toString() {
    return "(+" + this.countryCode + ") " + this.subcriberNumber;
  }

  static fromString(phoneNumber: string) {
    const numbers = phoneNumber.match(/\D\d{1,}\D/);
    if (!numbers) return null;
    return new PhoneNumber(numbers[0], numbers[1]);
  }
}

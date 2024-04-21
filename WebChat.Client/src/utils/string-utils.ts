export default class StringUtils {
  static normalizeString(str: string) {
    return str
      .normalize("NFD") // Chuyển đổi chuỗi sang dạng chuẩn Unicode NFD
      .replace(/[\u0300-\u036f]/g, "") // Loại bỏ các dấu diacritic
      .toLowerCase(); // Chuyển đổi tất cả thành chữ thường;
  }

  static searchStr(str: string, searchStr: string): boolean {
    const normalizeStr = StringUtils.normalizeString(str);
    const normalizeSearchStr = StringUtils.normalizeString(searchStr);

    return normalizeStr.includes(normalizeSearchStr);
  }

  static getNameOfPerson(str: string) {
    if (!str) return str;
    const words = str.split(" ").filter((w) => Boolean(w));
    if (!words.length) return str;
    const name = words[words.length - 1];
    return name;
  }
}

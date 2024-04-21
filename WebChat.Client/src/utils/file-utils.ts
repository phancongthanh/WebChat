import FileMetadata from "../types/FileMetadata";

export default class FileUtils {
  static downloadFile(name: string, file: Blob | File) {
    const fileURL = window.URL.createObjectURL(file);
    // Tạo một thẻ a để download file từ URL
    const a = document.createElement("a");
    // Thiết lập thuộc tính href là fileURL
    a.href = fileURL;
    a.setAttribute("download", name);
    a.click();
    URL.revokeObjectURL(fileURL);
  }
  static isImage(f?: File | FileMetadata | string | null): boolean {
    if (!f) return false;
    const type = (f as File).type;
    if (type && type.toString().includes("image")) return true;
    const contentType = (f as FileMetadata).contentType;
    if (contentType && contentType.toString().includes("image")) return true;
    return f.toString().includes("image");
  }
}

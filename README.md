# WebChat

## Mô Tả

Đây là một dự án về nhắn tin thời gian thực sử dụng React + Typescript + .Net Core, được thiết kế để cho phép người dùng trao đổi tin nhắn giữa bạn bè và nhóm người dùng với nhau.

## Chức Năng Cung Cấp

- **Friends:** Cho phép tìm, xem thông tin, chặn người dùng; gửi và quản lý các yêu cầu kết bạn.
- **Groups:** Hỗ trợ tạo, tìm nhóm bằng mã nhóm. Quản lý nhóm (cài đặt, danh sách lời mời và yêu cầu tham gia nhóm); phân quyền người dùng trong nhóm.
- **Conversations:** Cho phép gửi tin nhắn văn bản, emoji, hình ảnh và tệp tin theo 3 kiểu hội thoại: cá nhân, bạn bè và nhóm. Tin nhắn được tải chậm, gửi real time và cập nhật trạng thái gửi tin.

## Công Nghệ Sử Dụng

### [Frontend](https://github.com/phancongthanh/WebChat/blob/main/WebChat.Client/package.json)

- ReactJs
- Redux-Toolkit
- Axios
- Formik & Yup
- Material UI
- Tailwind CSS
- I18n

### [Backend](https://github.com/phancongthanh/WebChat/blob/main/Directory.Packages.props)

- ASP.Net Core API 8
- EF Core 8
- SignalR
- MediatR
- FluentValidation

### Database

- PostgreSQL

## Giấy Phép

[MIT License](https://github.com/phancongthanh/WebChat/blob/main/README.md)

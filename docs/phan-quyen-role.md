# Tài liệu tính năng phân quyền (Role) cho hệ thống eLearning

## 1. Mục đích

Tính năng phân quyền giúp kiểm soát quyền truy cập các chức năng trong hệ thống dựa trên loại người dùng (role). Ví dụ: chỉ giáo vụ (GV) mới được tạo, sửa, xoá khoá học; học viên (HV) chỉ được đăng ký khoá học.

## 2. Cấu trúc dữ liệu

- Bảng `UserTypes`: Lưu các loại người dùng (`GV`, `HV`...)
- Bảng `Users`: Mỗi user có trường `userTypeId` liên kết đến loại người dùng.
- Token JWT trả về trường `role` (ví dụ: `GV`, `HV`).

## 3. Cách hoạt động

- Khi đăng nhập, hệ thống trả về JWT chứa thông tin role.
- Các API cần bảo vệ sẽ sử dụng hai guard:
  - `AuthGuard('jwt')`: Kiểm tra xác thực người dùng.
  - `RolesGuard`: Kiểm tra quyền truy cập dựa trên role.
- Sử dụng decorator `@Roles('GV')` để đánh dấu các route chỉ cho phép giáo vụ truy cập.

## 4. Ví dụ sử dụng

```typescript
@Post()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('GV')
createCourse(@Body() dto: CreateCourseDto) {
  // chỉ giáo vụ mới được tạo khoá học
}
```

## 5. Hướng dẫn test

- Đăng nhập bằng tài khoản giáo vụ để lấy token.
- Gọi API có phân quyền, truyền token vào header:
  - Nếu role là `GV`: truy cập thành công.
  - Nếu role là `HV`: trả về lỗi 403 Forbidden.

## 6. Mở rộng

- Có thể thêm nhiều loại role khác (Admin, Teacher...)
- Phân quyền chi tiết hơn theo chức năng hoặc resource.

---

Nếu cần bổ sung chi tiết hoặc ví dụ, hãy liên hệ đội phát triển backend.

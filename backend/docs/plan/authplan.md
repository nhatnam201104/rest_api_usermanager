Login 

- đăng nhập bằng email, password
- gửi mã xác thực
- Mã xác thực có hiệu lực trong 5p
- Yêu cầu gửi lại mã mới
- Đăng kí xong trả về refersh token

Register

- Đăng kí với các thông tin:
  - email: validate email, not empty, unique
  - phone: validate phone, not empty, unique
  - password: not empty, min 6,  max 20
  - fullname: not empty, min 3 max 50
  - status default active
- Gửi mã xác thực qua mail, mã xác thực có hiệu lực trong vòng 5p, 1 phút có thể gửi lại
- Sau khi xác thực hoàn tất mới lưu vào database
- password hash
- accesstoken

Logout : xóa accesstoken

Forget password: gửi về mail link reset password

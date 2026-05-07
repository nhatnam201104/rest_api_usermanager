# **Hệ thống làm gì?** (tính năng chính)

Auth:         Đăng ký, Đăng nhập, Đổi thông tin cá nhân
Post:         Tạo/sửa/xóa bài, Đổi trạng thái (draft/private/published)
Interaction:  Like, Comment bài viết
Moderator:    Duyệt/từ chối bài, Ban/unban user
Admin:        Phân quyền, Thống kê (số user, bài, like theo ngày)

đối với bài viết, đây là core logic chính

- trạng thái: public, private, xóa. Ngoài ra còn có trạng thái được xét duyệt và không được xét duyệt
- user chủ bài post có quyền xóa, chỉnh public/private (chỉ khi được duyểtk)
- Moderator có quyền phê duyệt, xóa bài viết

# **Ai dùng?** (user roles: admin, user thường...)

- user
- admin
- kiểm duyệt viên

# **Dữ liệu trông như thế nào?** (các entity chính)

- user
- role
- post
- comment
- like

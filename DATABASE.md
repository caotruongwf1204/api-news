Bảng User: Lưu thông tin của người dùng đăng nhập vào hệ thống.

id (Primary Key)
username
email
password (cần mã hóa)
Bảng Role: Lưu các vai trò của người dùng (ví dụ: user, admin).

id (Primary Key)
name (ví dụ: 'user', 'admin')
Bảng UserRole: Liên kết giữa User và Role để quản lý phân quyền.

id (Primary Key)
userId (Foreign Key)
roleId (Foreign Key)
Bảng Banner: Lưu thông tin về banner trên trang web.

id (Primary Key)
image_url
link
alt_text
Bảng Section: Lưu thông tin về các phần trên các trang (trang chủ, giới thiệu, dịch vụ, v.v.).

id (Primary Key)
title
content
Bảng Page: Lưu thông tin về các trang của website.

id (Primary Key)
title
content
Bảng Address: Lưu thông tin về địa chỉ của công ty hoặc tổ chức.

id (Primary Key)
street
city
state
zip_code
Bảng Logo: Lưu thông tin về logo của website.

id (Primary Key)
image_url
Bảng BlogPost: Lưu thông tin về các bài viết blog.

id (Primary Key)
title
content
categoryId (Foreign Key)
Bảng Category: Lưu thông tin về các danh mục cho bài viết blog.

id (Primary Key)
name
Bảng Permission: Lưu các quyền truy cập vào các tính năng của trang web.

id (Primary Key)
name (ví dụ: 'create_banner', 'edit_page', 'delete_blogpost', v.v.)
Bảng RolePermission: Liên kết giữa Role và Permission để quản lý phân quyền.

id (Primary Key)
roleId (Foreign Key)
permissionId (Foreign Key)
Mô hình quan hệ giữa các bảng:

Một User có thể có nhiều UserRole.
Một Role có thể có nhiều UserRole.
Một UserRole chỉ thuộc về một User và một Role.
Một Category có thể có nhiều BlogPost.
Một BlogPost chỉ thuộc về một Category.
Một Role có thể có nhiều RolePermission.
Một Permission có thể thuộc về nhiều RolePermission.


Giả sử bạn có một trang "Home" với các phần "Header", "Services", và "Footer". Dữ liệu có thể trông như sau:

### Page:
id: 1
name: "Home"
### Sections:
Header

id: 1
name: "Header"
pageId: 1
contentId: 1
Services

id: 2
name: "Services"
pageId: 1
contentId: 2
Footer

id: 3
name: "Footer"
pageId: 1
contentId: 3
### Content:
Header Content

id: 1
data: { "text": "Welcome to our website!" }
Services Content

id: 2
data: { "services": ["Service 1", "Service 2", "Service 3"] }
Footer Content

id: 3
data: { "text": "Contact us at info@example.com" }

=> Với cấu trúc này, bạn có thể linh hoạt thêm, sửa và xóa các phần trên trang web thông qua CMS mà không cần thay đổi cấu trúc cơ sở dữ liệu.
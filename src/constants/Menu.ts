import { PermissionType } from './Role';

// Định nghĩa menu items cơ bản (có thể được mở rộng)
export const menuItems = [
    {
        name: 'Dashboard',
        url: '/dashboard',
        permissions: [] // Danh sách quyền cần có để truy cập mục này
    },
    {
        name: 'Articles',
        url: '/articles',
        permissions: [PermissionType.ARTICLE_VIEW] // Cần quyền xem bài viết để truy cập
    },
    {
        name: 'Categories',
        url: '/categories',
        permissions: [PermissionType.CATEGORY_VIEW] // Cần quyền xem danh mục để truy cập
    },
    {
        name: 'Users',
        url: '/users',
        permissions: [PermissionType.USER_VIEW] // Cần quyền xem người dùng để truy cập
    },
];

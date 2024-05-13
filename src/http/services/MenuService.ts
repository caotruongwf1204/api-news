import { menuItems } from "@/constants/Menu";

// Hàm để lọc menu items dựa trên quyền của người dùng
export function filterMenuItems(permissions: string[]): any[] {
    return menuItems.filter(item => {
        // Nếu mục menu không yêu cầu quyền hoặc người dùng có quyền cần thiết, giữ lại mục menu đó
        return item.permissions.length === 0 || item.permissions.some(permission => permissions.includes(permission));
    });
}

// // Ví dụ: danh sách quyền của người dùng
// const userPermissions = [
//     PermissionType.ARTICLE_VIEW,
//     PermissionType.CATEGORY_VIEW
// ];

// // Lọc danh sách menu dựa trên quyền của người dùng
// const filteredMenu = filterMenuItems(userPermissions);

// // In ra danh sách menu đã lọc
// console.log(filteredMenu);
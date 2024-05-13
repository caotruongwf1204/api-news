import { AppDataSource } from '../data-source';
import { User } from '../entities/User';
import bcrypt from 'bcryptjs';
import { Role } from '../entities/Role';
import { Permission } from '../entities/Permission';

export async function createUser(userType: string) {
    const userRepository = AppDataSource.getRepository(User);
    const roleRepository = AppDataSource.getRepository(Role);
    const permissionRepository = AppDataSource.getRepository(Permission);

    // Dữ liệu tài khoản
    let userData: { email: string, username: string, password: string };
    if (userType === 'admin') {
        userData = {
            email: 'admin@gmail.com',
            username: 'admin',
            password: 'password'
        };
    } else if (userType === 'editor') {
        userData = {
            email: 'editor@gmail.com',
            username: 'editor',
            password: 'password'
        };
    } else if (userType === 'user') {
        userData = {
            email: 'user@gmail.com',
            username: 'user',
            password: 'password'
        };
    }
     else {
        console.error('Invalid user type');
        return;
    }

    // Mã hóa mật khẩu trước khi lưu vào cơ sở dữ liệu
    const salt = await bcrypt.genSalt(10);
    const encodedPassword = await bcrypt.hash(userData.password, salt);

    // Tìm hoặc tạo mới role cho tài khoản
    let userRole = await roleRepository.findOne({ where: { name: userType === 'admin' ? 'Admin' : userType === 'editor' ? 'Editor' : 'User' } });
    if (!userRole) {
        userRole = new Role();
        userRole.name = userType === 'admin' ? 'Admin' : userType === 'editor' ? 'Editor' : 'User';
        await roleRepository.save(userRole);
    }

    // Lấy tất cả các quyền từ bảng Permission
    const permissions = await permissionRepository.find();

    // Gán quyền cho role tương ứng
    if (userRole && permissions.length > 0) {
        // Gán tất cả các quyền cho role Admin
        if (userType === 'admin') {
            userRole.permissions = permissions;
        }
        // Gán một số quyền cụ thể cho role Editor
        else if (userType === 'editor') {
            const specificPermissions = permissions.filter(permission => {
                // Ví dụ: chỉ gán quyền liên quan đến bài viết cho Editor
                return permission.name.startsWith('view') || permission.name.startsWith('create') || permission.name.startsWith('update');
            });
            userRole.permissions = specificPermissions;
        }
        await roleRepository.save(userRole);
    }

    // Tạo DTO cho tài khoản
    const dto = {
        email: userData.email,
        username: userData.username,
        password: encodedPassword,
        roles: [userRole]
    };

    // Kiểm tra xem người dùng đã tồn tại chưa
    const existingUser = await userRepository.findOne({ where: { email: dto.email } });
    if (existingUser) {
        console.info("User existed");
        return;
    }

    // Tạo và lưu tài khoản vào cơ sở dữ liệu
    const user = userRepository.create(dto);
    await userRepository.save(user);
}

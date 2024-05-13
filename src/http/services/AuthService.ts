import { AppDataSource } from "@/database/data-source";
import { Permission } from "@/database/entities/Permission";
import { Role } from "@/database/entities/Role";
import { User } from "@/database/entities/User";

export class AuthService{
    static async getAllPermissions(): Promise<string[]> {
        const permissionRepository = AppDataSource.getRepository(Permission);
        const permissions: Permission[] = await permissionRepository.find();
        return permissions.map(permission => permission.name);
      }
    static async setRole(userId: number, roleId: number):Promise <object> {
      try {
        const repo = AppDataSource.getRepository(Role)
        const repo2 = AppDataSource.getRepository(User)
        const check_user = await repo2.findOneByOrFail({id: userId})
        const check_role = await repo.findOneByOrFail({id: roleId})
        if (!check_role) throw new Error('Role not found')
        if (!check_user) throw new Error('User not found')
        await repo.query(`insert into user_role(usersId, rolesId) values (${userId}, ${roleId})`)
        const data = {user: check_user, role: check_role}
        return data
      } catch (error) {
        console.log(error)
        //@ts-ignore
        throw new Error(error)
      }
    }
}
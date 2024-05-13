import { Paginator } from "@/database/Paginator"
import { AppDataSource } from "@/database/data-source"
import { User } from "@/database/entities/User"
import { Brackets, Equal, Like } from "typeorm"

export class UserService {
  static async getUsers(queryParams: any): Promise<{ users: any[]; paginationInfo?: any }> {
    try {
      const repo = AppDataSource.getRepository(User)
      const { pageSize, pageNumber, isAll, searchLike, searchEqual, ...otherParams } = queryParams

      let whereClause: any = {}
      // Xử lý tìm kiếm chính xác (Equal)
      if (searchEqual) {
        for (const key in searchEqual) {
          if (searchEqual.hasOwnProperty(key)) {
            whereClause[key] = Equal(searchEqual[key])
          }
        }
      }
      // Xử lý tìm kiếm theo mẫu (Like)
      if (searchLike) {
        // Sử dụng Brackets để tạo một nhóm điều kiện
        whereClause = new Brackets((qb) => {
          Object.entries(searchLike).forEach(([key, value]) => {
            qb.andWhere(`${key} LIKE :value`, { value: `%${value}%` });
          });
        });
      }
      // Xử lý các tham số tìm kiếm khác như trước
      if (otherParams) {
        for (const key in otherParams) {
          if (otherParams.hasOwnProperty(key)) {
            whereClause[key] = Like(`%${otherParams[key]}%`);
          }
        }
      }
  
      const queryBuilder = repo.createQueryBuilder("users")
        .leftJoinAndSelect("users.roles", "roles")
        .where(whereClause)
        .orderBy("users.id", "DESC");
      // Thực hiện phân trang nếu không phải là tất cả
      if (!isAll) {
        const { records, paginationInfo } = await Paginator.paginate(queryBuilder, queryParams)
        const users = records.map((user: any) => ({
          id: user.id,
          username: user.username,
          email: user.email,
          imgUrl: user.imgUrl,
          roles: user.roles.map((role: any) => role.name),
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          deletedAt: user.deletedAt,
        }))
        return { users, paginationInfo }
      } else {
        // Không thực hiện phân trang, trả về tất cả dữ liệu người dùng
        const records = await queryBuilder.getMany()
        const users = records.map((user: any) => ({
          id: user.id,
          username: user.username,
          email: user.email,
          imgUrl: user.imgUrl,
          roles: user.roles.map((role: any) => role.name),
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          deletedAt: user.deletedAt,
        }))

        return { users }
      }
    } catch (error) {
      throw new Error("Đã xảy ra lỗi khi lấy danh sách người dùng" + error)
    }
  }
  static async getUserById(userId: number): Promise<any> {
    try {
      const repo = AppDataSource.getRepository(User);
      const user = await repo.findOne({where: { id: userId }});
      if (!user) {
        throw new Error("User not found");
      }
      return user;
    } catch (error:any) {
      throw new Error("Error while getting user by id: " + error.message);
    }
  }
}

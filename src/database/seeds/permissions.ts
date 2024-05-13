
import { permissions } from "../../constants/Role"
import { AppDataSource } from "../data-source"
import { Permission } from "../entities/Permission"

export default async function createDefaultPermission() {
    const repo = AppDataSource.getRepository(Permission)
    // Kiểm tra xem permission đã tồn tại chưa
    // Nếu chưa có thì insert vào database
        try {
        for(let item of permissions) {
            const check = await repo.findOne({where: {name: item}})
            if (!check) {
                const newItem = { name: item, createdDate: () => 'CURRENT_TIMESTAMP' };
                await repo.createQueryBuilder().insert().into(Permission).values(newItem).execute()
            }
        }
        } catch (error) {
        console.log(error)
        }
}


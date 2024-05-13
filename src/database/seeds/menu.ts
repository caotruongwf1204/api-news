import { menuItems } from "@/constants/Menu"
import { AppDataSource } from "../data-source"
import { Menu } from "../entities/Menu"
import { Permission } from "../entities/Permission"
import e from "cors"

export default async function createDefaultMenu() {
  const repo = AppDataSource.getRepository(Menu)
  const repo2 = AppDataSource.getRepository(Permission)
  console.log("addmenu")
  try {
    for (let item of menuItems) {
      const check = await repo.findOne({ where: { name: item.name } })
      if (!check) {
        const newItem = repo.create({
          name: item.name,
          url: item.url,
        })
        //add vào bảng Menu
        const newData = await repo.save(newItem)
        for (let permiss of item.permissions) {
          const per = await repo2.findOne({ where: { name: permiss } })
            await repo2.query(`insert into menu_permission (menuId, permissionsId) values (${newData.id},${per?.id})`)
        }
      }
      console.log("end")
    }
  } catch (error) {
    console.log(error)
  }
}

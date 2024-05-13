import { menuItems } from "@/constants/Menu"
import { PermissionType } from "@/constants/Role"
import { AppDataSource } from "@/database/data-source"
import { Menu } from "@/database/entities/Menu"
import { User } from "@/database/entities/User"
import e, { NextFunction, Request, Response } from "express"

type menuType = {
  name: string
  url: string
  permissions: PermissionType[]
}

export class MenuController {
  static async getMenu(req: Request, res: Response, next: NextFunction) {
    // @ts-ignore
    const permissions = req.permissions
    const repo = AppDataSource.getRepository(Menu)
    const data = await repo.query(
      "SELECT menu.name AS name, menu.url AS url, GROUP_CONCAT(permissions.name) AS permissions FROM menu INNER JOIN menu_permission ON menu.id = menu_permission.menuId INNER JOIN permissions ON menu_permission.permissionsId = permissions.id GROUP BY menu.name, menu.url"
    )
    const items = data
    let menu: menuType[] = []

    const getMenu = await AppDataSource.getRepository(Menu).find()

    const uniqueMenus = getMenu.filter(
      (menuItem) => !items.some((item) => item.name === menuItem.name && item.url === menuItem.url)
    )
    for (let uniqueMenu of uniqueMenus) {
      const { name, url } = uniqueMenu
      menu.push({ name, url, permissions: [] })
    }

    for (let item of items) {
      for (let permiss of item.permissions.split(",")) {
        if (permissions.includes(permiss)) menu.push(item)
        break
      }
    }
    return res.status(200).json({ menuItems: menu })
  }
}

import { ResponseUtil } from "@/utils/Response";
import { filterMenuItems } from "../services/MenuService";
import { Request, Response, NextFunction } from "express"

export class BootstrapController {
    static async getMenu(req: Request, res: Response) {
        // @ts-ignore
        const userPermissions: string[] = req.permissions;
        // Gọi hàm filterMenuItems để lọc danh sách menu dựa trên quyền của người dùng
        const menu = filterMenuItems(userPermissions);
        // Trả về danh sách menu cho người dùng
        return ResponseUtil.sendResponse(res, "Fetched menu successfully", menu)
    }
}
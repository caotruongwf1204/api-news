import { validateOrReject } from "class-validator"
import { AppDataSource } from "@/database/data-source"
import { ResponseUtil } from "@/utils/Response"
import { Request, Response } from "express"
import { Page } from "@/database/entities/Page"
import { CreatePageDTO, UpdatePageDTO } from "../dtos/PageDTO"
import { Paginator } from "@/database/Paginator"
import { PageService } from "../services/PageService"

export class PageController {
  //them Page
  static async createPage(req: Request, res: Response) {
    const pageData = req.body
    const dto = new CreatePageDTO()
    Object.assign(dto, pageData)

    await validateOrReject(dto)
    const repo = AppDataSource.getRepository(Page)
    const existingPage = await repo.findOne({ where: { name: pageData.name } })
    if (existingPage) {
      return ResponseUtil.sendResponse(res, "Page with this name already exists", null, 400)
    }

    const page = repo.create(pageData)
    await repo.save(page)

    return ResponseUtil.sendResponse(res, "Successfully created new Page", page)
  }

  //lay Page
  static async getPage(req: Request, res: Response) {
    const name = req.query.name
    try {
      if(!name){
      const getPage = await PageService.getAllPages()
      return res.status(200).json({messsage: `Succesfull`, data: getPage})
      }
      const getPage = await PageService.getPageByName(String(name))
      return res.status(200).json({messsage: `Succesfull`, data: getPage})
    } catch (error) {
      console.log(error)
      return res.status(500).json({message: "Fail!"})
    }
  }

  //lay Page by id
  static async getPageById(req: Request, res: Response) {
    const { id } = req.params
    const page = await AppDataSource.getRepository(Page).findOneByOrFail({
      id: Number(id),
    })
    return ResponseUtil.sendResponse<Page>(res, "Fetch Page successfully", page)
  }

  //update page
  static async updatePage(req: Request, res: Response) {
    const { id } = req.params
    const pageData = req.body

    const dto = new UpdatePageDTO()
    Object.assign(dto, pageData)
    dto.id = parseInt(id)

    await validateOrReject(dto)
    const repo = AppDataSource.getRepository(Page)
    const page = await repo.findOneByOrFail({
      id: Number(id),
    })

    repo.merge(page, pageData)
    await repo.save(page)
    return ResponseUtil.sendResponse(res, "Successfully updated the Page", page)
  }

  // xoa Page
  static async deletePage(req: Request, res: Response) {
    const { id } = req.params
    const repo = AppDataSource.getRepository(Page)
    const page = await repo.findOneByOrFail({
      id: Number(id),
    })

    await repo.remove(page)
    return ResponseUtil.sendResponse(res, "Successfully deleted the Page", null)
  }
}

import { Request, Response } from "express"
import { AppDataSource } from "@/database/data-source"
import { Content } from "@/database/entities/Content"
import { AuthenticatedRequest } from "@/interface/common"
import { CreateContentDto } from "../dtos/ContentDTO"
import { ResponseUtil } from "@/utils/Response"
import { validateOrReject } from "class-validator"

export class ContentController {
  //create content
  static async create(req: Request, res: Response) {
    const contentData = req.body

    const dto = new CreateContentDto()
    Object.assign(dto, contentData)
    await validateOrReject(dto)
    const repo = AppDataSource.getRepository(Content)

    const existingContent = await repo.findOne({ where: { data: contentData.data } })
    if (existingContent) {
      return res.status(409).json({ message: "Content with the same data already exists" })
    }
    const content = repo.create(contentData)
    await repo.save(content)
    
    return ResponseUtil.sendResponse(res, "Successfully created new content", content)
  }

  // lấy all content
  static async getContent(req: Request, res: Response) {
    const getContent = await AppDataSource.getRepository(Content).createQueryBuilder().getMany()
    const contentData = getContent.map((content: Content) => content)
    return ResponseUtil.sendResponse(res, "Fetched content successfully", contentData)
  }
  //lay content theo id
  static async getContentById(req: Request, res: Response) {
    const { id } = req.params
    const content = await AppDataSource.getRepository(Content).findOneByOrFail({
      id: Number(id),
    })

    return ResponseUtil.sendResponse<Content>(res, "Fetch content successfully", content)
  }

  static async update(req: AuthenticatedRequest, res: Response) {
    try {
      const contentId = req.params.id
      const contentRepository = AppDataSource.getRepository(Content)
      const content = await contentRepository.findOne({
        where: {
          id: Number(contentId),
        },
      })

      if (!content) {
        return res.status(404).json({ message: "Content not found" })
      }

      const contentData: any = req.body
      contentRepository.merge(content, contentData)
      await contentRepository.save(content)

      res.json({ message: "Content updated successfully" })
    } catch (error: any) {
      console.error(error.message)
      res.status(500).json({ message: "Server Error" })
    }
  }

  static async delete(req: AuthenticatedRequest, res: Response) {
    try {
      const contentId = req.params.id
      const contentRepository = AppDataSource.getRepository(Content)
      const content = await contentRepository.findOne({
        where: {
          id: Number(contentId),
        },
      })

      if (!content) {
        return res.status(404).json({ message: "Content not found" })
      }

      await contentRepository.remove(content)

      res.json({ message: "Content deleted successfully" })
    } catch (error: any) {
      console.error(error.message)
      res.status(500).json({ message: "Server Error" })
    }
  }
}

export default ContentController

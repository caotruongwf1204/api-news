import { Request, Response } from "express"
import { CreateSectionDTO, UpdateSectionDTO } from "../dtos/SectionDTO"
import { validateOrReject } from "class-validator"
import { ResponseUtil } from "@/utils/Response"
import { AppDataSource } from "@/database/data-source"
import { Section } from "@/database/entities/Section"

export class SectionController {
  //them section
  static async createSection(req: Request, res: Response) {
    const sectionData = req.body
    const dto = new CreateSectionDTO()
    Object.assign(dto, sectionData)

    await validateOrReject(dto)
    const repo = AppDataSource.getRepository(Section)
    const existingSection = await repo.findOne({ where: { name: sectionData.name } })
    if (existingSection) {
      return ResponseUtil.sendResponse(res, "name already exists", null, 400)
    }

  
    const section = repo.create(sectionData)
    await repo.save(section)

    return ResponseUtil.sendResponse(res, "Successfully created new section", section)
  }

  // lay tat ca section
  static async getSection(req: Request, res: Response) {
    const getSection = await AppDataSource.getRepository(Section).createQueryBuilder().getMany()
    const sectionData = getSection.map((section: Section) => section)
    return ResponseUtil.sendResponse(res, "Fetched section successfully", sectionData)
  }

  //section by id
  static async getSectionById(req: Request, res: Response) {
    const { id } = req.params
    const section = await AppDataSource.getRepository(Section).findOneByOrFail({
      id: Number(id),
    })
    return ResponseUtil.sendResponse<Section>(res, "Fetch section successfully", section)
  }

  //update section
  static async updateSection(req: Request, res: Response) {
    const { id } = req.params
    const sectionData = req.body

    const dto = new UpdateSectionDTO()
    Object.assign(dto, sectionData)
    dto.id = parseInt(id)

    await validateOrReject(dto)
    const repo = AppDataSource.getRepository(Section)
    const section = await repo.findOneByOrFail({
      id: Number(id),
    })

    repo.merge(section, sectionData)
    await repo.save(section)
    return ResponseUtil.sendResponse(res, "Successfully updated the section", section)
  }

  // xoa section
  static async deleteSection(req: Request, res: Response) {
    const { id } = req.params
    const repo = AppDataSource.getRepository(Section)
    const section = await repo.findOneByOrFail({
      id: Number(id),
    })

    await repo.remove(section)
    return ResponseUtil.sendResponse(res, "Successfully deleted the section", null)
  }
}

import { validateOrReject } from "class-validator"
import { CreateCategoryDTO, UpdateCategoryDTO } from "../dtos/CategoryDTO"
import { AppDataSource } from "@/database/data-source"
import { Category } from "@/database/entities/Category"
import { ResponseUtil } from "@/utils/Response"
import { Request, Response } from "express"

export class CategoryController {
  //them category
  static async createCategory(req: Request, res: Response) {
    const categoryData = req.body
    const dto = new CreateCategoryDTO()
    Object.assign(dto, categoryData)

    await validateOrReject(dto)
    const repo = AppDataSource.getRepository(Category)
    const existingCategory = await repo.findOne({ where: { name: categoryData.name } })
    if (existingCategory) {
      return res.status(409).json({message: "Category with this name already exists"})
    }

    const category = repo.create(categoryData)
    await repo.save(category)

    return ResponseUtil.sendResponse(res, "Successfully created new category", category)
  }

  //lay category
  static async getCategory(req: Request, res: Response) {
    const getCategory = await AppDataSource.getRepository(Category).createQueryBuilder().getMany()
    const categoryData = getCategory.map((category: Category) => category)
    return ResponseUtil.sendResponse(res, "Fetched category successfully", categoryData)
  }

  //lay category by id
  static async getCategoryById(req: Request, res: Response) {
    const { id } = req.params
    const category = await AppDataSource.getRepository(Category).findOneByOrFail({
      id: Number(id),
    })
    return ResponseUtil.sendResponse<Category>(res, "Fetch category successfully", category)
  }

  //update category
  static async updateCategory(req: Request, res: Response) {
    const { id } = req.params
    const categoryData = req.body

    const dto = new UpdateCategoryDTO()
    Object.assign(dto, categoryData)
    dto.id = parseInt(id)

    await validateOrReject(dto)
    const repo = AppDataSource.getRepository(Category)
    const category = await repo.findOneByOrFail({
      id: Number(id),
    })

    repo.merge(category, categoryData)
    await repo.save(category)
    return ResponseUtil.sendResponse(res, "Successfully updated the category", category)
  }

  // xoa category
  static async deleteCategory(req: Request, res: Response) {
    const { id } = req.params
    const repo = AppDataSource.getRepository(Category)
    const category = await repo.findOneByOrFail({
      id: Number(id),
    })

    await repo.remove(category)
    return ResponseUtil.sendResponse(res, "Successfully deleted the category", category)
  }
}

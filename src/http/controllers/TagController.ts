import { Request, Response } from "express"
import { AppDataSource } from "@/database/data-source"
import { Tag } from "@/database/entities/Tag"
import { ValidationError, validateOrReject } from "class-validator"
import { CreateTagDto } from "../dtos/TagDTO"
import { RequestHandler } from "express"
import { ParamsDictionary } from "express-serve-static-core"
import { UpdateTagDto } from "../dtos/TagDTO"
import { ParsedQs } from "qs"
import { In } from "typeorm"

export class TagController {
  static async create(req: Request, res: Response) {
    try {
      const tagRepository = AppDataSource.getRepository(Tag)
      const tagData = req.body

      const createTagDto = new CreateTagDto()
      createTagDto.name = tagData.name
      // Add more properties if necessary

      await validateOrReject(createTagDto)

      const existingTag = await tagRepository.findOne({ where: { name: createTagDto.name } })
      if (existingTag) {
        return res.status(400).json({ message: "Tag already exists" })
      }

      const newTag = tagRepository.create({
        name: createTagDto.name,
        // Add more properties if necessary
      })

      await tagRepository.save(newTag)

      res.status(201).json({ message: "Tag created successfully", newTag })
    } catch (error: any) {
      console.error(error.message)
      res.status(500).json({ message: "Server Error" })
    }
  }

  static async getTags(req: Request, res: Response) {
    try {
      const tagRepository = AppDataSource.getRepository(Tag)
      const tags = await tagRepository.find()

      res.json(tags)
    } catch (error: any) {
      console.error(error.message)
      res.status(500).json({ message: "Server Error" })
    }
  }

  static async getTagById(req: Request, res: Response) {
    try {
      const tagRepository = AppDataSource.getRepository(Tag)
      const tagId = req.params.id
      const tag = await tagRepository.findOne({ where: { id: parseInt(tagId) } })

      if (!tag) {
        return res.status(404).json({ message: "Tag not found" })
      }

      res.json(tag)
    } catch (error: any) {
      console.error(error.message)
      res.status(500).json({ message: "Server Error" })
    }
  }

  static async updateTag(req: Request, res: Response) {
    try {
      const tagRepository = AppDataSource.getRepository(Tag)

      const tagId: number = parseInt(req.params.id)

      const tagData = req.body

      const tag = await tagRepository.findOne({ where: { id: tagId } })

      if (!tag) {
        return res.status(404).json({ message: "Tag not found" })
      }

      // Update tag properties
      tag.name = tagData.name
      // Add more properties if necessary

      await tagRepository.save(tag)

      res.json({ message: "Tag updated successfully", data: tag })
    } catch (error: any) {
      console.error(error.message)
      res.status(500).json({ message: "Server Error" })
    }
  }
  static async deleteTag(req: Request, res: Response) {
    try {
      const tagRepository = AppDataSource.getRepository(Tag)
      const tagId = req.params.id
      const tag = await tagRepository.findOne({ where: { id: parseInt(tagId) } })

      if (!tag) {
        return res.status(404).json({ message: "Tag not found" })
      }

      await tagRepository.remove(tag)

      res.json({ message: "Tag deleted successfully",data: tag })
    } catch (error: any) {
      console.error(error.message)
      res.status(500).json({ message: "Server Error" })
    }
  }

  static async createMultipleTags(req: Request, res: Response) {
    try {
      const tagRepository = AppDataSource.getRepository(Tag)
      const tagDataArray = req.body // Dữ liệu đầu vào chứa mảng các tags

      if (!Array.isArray(tagDataArray.name)) {
        return res.status(400).json({ message: "invalid body" })
      }

      // Kiểm tra xem các tag đã tồn tại hay không
      const existingTags = await tagRepository.find({
        where: {
          name: In(tagDataArray.name),
        },
      })

      // Lấy danh sách tên tags từ body request
      const tagNames = tagDataArray.name

      // Lọc ra các tag chưa tồn tại trong cơ sở dữ liệu
      const newTagNames = tagNames.filter((tagName) => !existingTags.some((tag) => tag.name === tagName))

      // Nếu tất cả các tag đã tồn tại, trả về thông báo lỗi
      if (newTagNames.length === 0) {
        return res.status(400).json({ message: "duplicate tag name" })
      }

      // Tạo các DTO cho các tag mới
      const createTagDtos = newTagNames.map((name: string) => ({
        name,
      }))

      // Tạo và lưu các tag mới vào cơ sở dữ liệu
      const newTags = tagRepository.create(createTagDtos)
      await tagRepository.save(newTags)

      res.status(201).json({ message: "Tags created successfully", data:newTags })
    } catch (error: any) {
      console.error(error.message)
      res.status(500).json({ message: "Server Error" })
    }
  }

  static async deleteMultipleTags(req: Request, res: Response) {
    try {
      const tagRepository = AppDataSource.getRepository(Tag)
      const tagDataArray = req.body

      // Kiểm tra dữ liệu đầu vào
      if (!Array.isArray(tagDataArray.name)) {
        res.status(400).json({ message: "Dữ liệu không hợp lệ. Vui lòng gửi một mảng các tags." })
      }
      const numberDeletedTag = await tagRepository.count({
        where: {
          name: In(tagDataArray.name),
        },
      })
      if (numberDeletedTag !== tagDataArray.name.length) {
        res.status(400).json({ message: "tag not found." })
      }
      await tagRepository.delete({
        name: In(tagDataArray.name),
      })

      res.status(200).json({ message: "Các tags đã được xóa thành công.", data: tagDataArray.name })
    } catch (error: any) {
      console.error(error.message)
      res.status(500).json({ message: "Lỗi máy chủ." })
    }
  }
}

export default TagController

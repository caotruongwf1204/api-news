import { ResponseUtil } from "@/utils/Response"
import { FileService } from "../services/FileService"
import { File } from "@/database/entities/File"
import { AppDataSource } from "@/database/data-source"
import { fi } from "@faker-js/faker"
import { Request, Response } from "express"
import { CreateFolderDTO, UpdateFileDTO } from "../dtos/FileDTO"
import { validateOrReject } from "class-validator"
import { Folder } from "@/database/entities/Folder"
import { In } from "typeorm"

export class FileController {
  static async uploadFile(req: any, res: any) {
    try {
      const folderId = req.body.folderId
      const url = await FileService.uploadFile(req)

      if (!req.file || typeof req.file.originalname !== "string") {
        throw new Error("Invalid file data")
      }

      // Tạo một bản ghi mới của entity File
      const fileRepository = AppDataSource.getRepository(File)
      const newFile = new File()
      newFile.filename = req.file.originalname
      newFile.filetype = req.file.mimetype as string
      newFile.user = req?.user
      newFile.folderId = folderId
      console.log("dfsfsd", folderId)
      // Kiểm tra đường dẫn có tồn tại và có phải kiểu string không
      if (typeof url !== "string") {
        throw new Error("Invalid file path")
      }
      newFile.filepath = url

      // Lưu bản ghi mới vào cơ sở dữ liệu
      await fileRepository.save(newFile)
      const responseFile = { ...newFile }
      //@ts-ignore
      delete responseFile.user

      // Trả về phản hồi
      return ResponseUtil.sendResponse(res, "Upload file thành công", responseFile, null)
    } catch (error: any) {
      console.error("Error uploading file:", error)
      return ResponseUtil.sendResponse(res, "Lỗi khi upload file", null, error.message)
    }
  }
  static async updateFile(req: Request, res: Response) {
    try {
      const { id } = req.params
      const fileData = req.body

      const dto = new UpdateFileDTO()
      Object.assign(dto, fileData)
      await validateOrReject(dto)

      const repo = AppDataSource.getRepository(File)
      const file = await repo.findOneByOrFail({ id: Number(id) })

      if (!file) {
        return res.status(404).json({ message: "File not found" })
      }
      file.filename = fileData.filename
      await repo.save(file)

      return res.status(200).json({ message: "File updated successfully", file })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: "server error", error })
    }
  }

  static async deleteFile(req: Request, res: Response) {
    try {
      const fileDataArray = req.body

      const file = AppDataSource.getRepository(File)
      if (!Array.isArray(fileDataArray.id)) {
        res.status(400).json({ message: "Dữ liệu không hợp lệ." })
      }

      const deleteFile = await file.count({
        where: {
          id: In(fileDataArray.id),
        },
      })
      if (deleteFile !== fileDataArray.id.length) {
        res.status(400).json({ message: "file not found." })
      }

      await file.delete({
        id: In(fileDataArray.id),
      })

      return res.status(200).json({ message: "Delete file success" })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: "server error" })
    }
  }

  static async getFile(req: Request, res: Response) {
    try {
      const files = await FileService.getFiles(req.body)
      return res.status(200).json({ message: "Get all File success", data: files.fileDatas, pageInfo: files.pageInfo })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: "server error" })
    }
  }

  static async createFolder(req: Request, res: Response) {
    try {
      // @ts-ignore
      const userId = req.user.id
      const folderData = req.body
      const parentFolderId = req.query.parent

      const repo = AppDataSource.getRepository(Folder)

      if (typeof folderData.name === "string" && folderData.name.trim() === "") {
        folderData.name = "New folder"
      }

      let folderName = folderData.name
      let index = 1
      while (true) {
        const existingFolder = await repo.findOne({ where: { name: folderName } })
        if (!existingFolder) {
          break
        }
        folderName = `${folderData.name} (${index})`
        index++
      }

      if (parentFolderId) {
        const check = await repo.findOne({ where: { id: Number(parentFolderId) } })
        if (!check) return res.status(404).json({ message: "Parent folder not found" })
      }
      const folder = {
        ...folderData,
        name: folderName,
        userId,
        parent: parentFolderId,
      }

      const data = await FileService.createFolder(folder)
      //@ts-ignore
      const id = data.insertId
      folder.id = id

      return res.status(200).json({ message: "create new folder success", folder })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: "server error" })
    }
  }

  static async updateFolder(req: Request, res: Response) {
    try {
      const { id } = req.params
      const folderData = req.body

      const repo = AppDataSource.getRepository(Folder)
      const folder = await repo.findOneByOrFail({ id: Number(id) })

      if (!folder) {
        return res.status(404).json({ message: "Folder not found" })
      }

      if (typeof folderData.name === "string" && folderData.name.trim() === "") {
        folderData.name = "New folder"
      }
      if (folderData.name !== folder.name) {
        const folderWithNewName = await repo.findOne({ where: { name: folderData.name } })
        if (folderWithNewName) {
          return res.status(409).json({ message: "Folder with this name already exists" })
        }

        folder.name = folderData.name
        await repo.save(folder)
        return res.status(200).json({ message: "Folder updated successfully", folder: folder })
      }
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: "server error" })
    }
  }

  static async deleteFolder(req: Request, res: Response) {
    try {
      const folderDataArray = req.body

      const folder = AppDataSource.getRepository(Folder)
      if (!Array.isArray(folderDataArray.id)) {
        res.status(400).json({ message: "Dữ liệu không hợp lệ." })
      }

      const deletedFolders = await folder.find({
        where: {
          id: In(folderDataArray.id),
        },
      });

      if (deletedFolders.length !== folderDataArray.id.length) {
        return res.status(400).json({ message: "folder not found." });
    }
      
      await folder.delete({
        id: In(folderDataArray.id),
      });
      return res.status(200).json({ message: "Delete folder success", data: deletedFolders })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: "server error" })
    }
  }

  static async getAllFolder(req: Request, res: Response) {
    try {
      const folders = await FileService.getFolders(req.body)
      return res
        .status(200)
        .json({ message: "Get all Folder success", data: folders.folderDatas, pageInfo: folders.pageInfo })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: "server error" })
    }
  }

  static async getFolderbyId(req: Request, res: Response) {
    try {
      const { id } = req.params
      const folder = await FileService.getFolderById(Number(id))
      return res.status(200).json({ message: `get folder by id ${id} success`, folder })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: "server error" })
    }
  }
}

import { Paginator } from "@/database/Paginator"
import { AppDataSource } from "@/database/data-source"
import { File } from "@/database/entities/File"
import { Folder } from "@/database/entities/Folder"
import { upload } from "@/utils/MulterConfig"
import multer from "multer"
import { Like } from "typeorm"
import { CreateFolderDTO } from "../dtos/FileDTO"
import { validateOrReject } from "class-validator"
import { UserService } from "./UserService"

export class FileService {
  static async uploadFile(req: any) {
    return new Promise((resolve, reject) => {
      upload.single("file")(req, {} as any, function (err: any) {
        if (err instanceof multer.MulterError) {
          reject(err)
        } else if (err) {
          reject(err)
        } else if (!req.file) {
          reject(new Error("No file uploaded"))
        } else {
          const url = req.protocol + "://" + req.get("host") + "/public/uploads/" + req.file.filename
          resolve(url)
        }
      })
    })
  }

  static async getFiles(queryParams: any): Promise<{ fileDatas: any[]; pageInfo: any }> {
    const repo = AppDataSource.getRepository(File)
    try {
      const { pageSize, pageNumber, isAll, ...searchParams } = queryParams
      let whereClause: any = {}

      if (searchParams) {
        for (const key in searchParams) {
          if (searchParams.hasOwnProperty(key)) {
            whereClause[key] = Like(`%${searchParams[key]}%`)
          }
        }
      }

      let files: File[]
      let fileDatas: any[] = []
      let pageInfo: any = null

      const queryBuilder = repo.createQueryBuilder("file").leftJoinAndSelect("file.folder", "folder", "file.folderId = folder.id").where(whereClause)

      if (!isAll) {
        const { records, paginationInfo } = await Paginator.paginate(queryBuilder, queryParams)
        files = records
        pageInfo = paginationInfo
        return { fileDatas: files, pageInfo }
      } else {
        files = await queryBuilder.getMany()
        return { fileDatas: files, pageInfo }
      }
    } catch (error) {
      throw new Error("Error occurred while fetching folder" + error)
    }
  }

  static async getFileByFolderId(folderId: number): Promise<any> {
    try {
      const repo = AppDataSource.getRepository(File)
      const file = await repo.createQueryBuilder("file").where(`folderId = ${folderId}`).getMany()
      if (!file) {
        throw new Error("File not found")
      }
      return file
    } catch (error) {
      throw new Error("Error occurred while fetching folder" + error)
    }
  }

  static async createFolder(data: any): Promise<{}> {
    const parentFolderId = data.parent
    const repo = AppDataSource.getRepository(Folder)
    if (parentFolderId) {
      const check = await repo.findOne({ where: { id: Number(parentFolderId) } })
      if (!check) throw new Error("Parent comment not found")
    }

    const createFolder = await repo.query(
      `insert into folders (name, userId${parentFolderId ? ",parentFolder" : ""}) values ('${data.name}',${
        data.userId
      }${parentFolderId ? "," + parentFolderId : ""})`
    )
    const userInfo = await UserService.getUserById(data.userId)
    return {
      ...createFolder,
      user: {
        id: userInfo.id,
        name: userInfo.username,
        email: userInfo.email,
      },
    }
  }

  static async getFolders(queryParams: any): Promise<{ folderDatas: any[]; pageInfo: any }> {
    const repo = AppDataSource.getRepository(Folder)
    console.log(queryParams)
    try {
      const { pageSize, pageNumber, isAll, ...searchParams } = queryParams
      let whereClause: any = {}

      if (searchParams) {
        for (const key in searchParams) {
          if (searchParams.hasOwnProperty(key)) {
            whereClause[key] = Like(`%${searchParams[key]}%`)
          }
        }
      }

      let folders: Folder[]
      let folderDatas: any[] = []
      let pageInfo: any = null

      const queryBuilder = repo.createQueryBuilder("folder").where(whereClause)

      if (!isAll) {
        const { records, paginationInfo } = await Paginator.paginate(queryBuilder, queryParams)
        folders = records
        for (let item of folders) {
          const files = await FileService.getFileByFolderId(item.id)
          //@ts-ignore
          folderDatas.push({ ...item, files: files })
        }
        pageInfo = paginationInfo
        return { folderDatas, pageInfo }
      } else {
        folders = await queryBuilder.getMany()
        for (let item of folders) {
          const files = await FileService.getFileByFolderId(item.id)
          //@ts-ignore
          folderDatas.push({ ...item, files: files })
        }
        return { folderDatas, pageInfo }
      }
    } catch (error) {
      // Handle errors
      throw new Error("Error occurred while fetching folder" + error)
    }
  }

  static async getFolderById(id: number): Promise<{}> {
    const repo = AppDataSource.getRepository(Folder)
    let folderDatas = {}
    try {
      const folder = await repo.findOneOrFail({ where: { id } })
      folderDatas = folder
      return folderDatas
    } catch (error) {
      throw new Error("An error occured:" + error)
    }
  }
}

import { Request, Response } from "express"
import { AppDataSource } from "@/database/data-source"
import { Comment } from "@/database/entities/Comment"
import { ValidationError, validateOrReject } from "class-validator"
import { CreateCommentDto } from "../dtos/CommentDTO"
import { User } from "@/database/entities/User"
import { ResponseUtil } from "@/utils/Response"
import { CommentService } from "../services/CommentService"
import { UserService } from "../services/UserService"
import { Notification } from "@/database/entities/Notification"

export class CommentController {
  static async create(req: Request, res: Response) {
    // @ts-ignore
    const user = req.user
    const cmtData = req.body
    const parentCommentId = req.query.parent
    const repo = AppDataSource.getRepository(Comment)
    if (parentCommentId) {
      const check = await repo.findOne({ where: { id: Number(parentCommentId) } })
      if (!check) return res.status(404).json({ message: "Parent comment not found" })
    }

    const dto = new CreateCommentDto()
    Object.assign(dto, cmtData)
    await validateOrReject(dto)
    console.log(user)
    const cmt = {
      ...cmtData,
      userId: user.id,
      parent: parentCommentId,
    }
    const result = await CommentService.createComment(cmt)

    const notification = new Notification()
    notification.notification = `"${user.username}" tạo bình luận "${cmt.content}" thành công`
    notification.userId = user
    //@ts-ignore
    notification.commentsId = result.insertId
    const notificationData = await AppDataSource.getRepository(Notification)
    notificationData.save(notification)

    console.log(notification)

    return ResponseUtil.sendResponse(res, "Successfully created new comment", result)
  }

  static async get(req: Request, res: Response) {
    try {
      const data = req.body
      // const cmtData = await CommentService.getComments(Number(postId))

      const result = await CommentService.getComments(data)
      return ResponseUtil.sendResponse(res, "Fetched comment successfully", result)
    } catch (error) {
      return ResponseUtil.sendResponse(res, "Fetched comment fail:", error)
    }
  }
  static async getById(req: Request, res: Response) {
    const { id } = req.params
    const cmt = await AppDataSource.getRepository(Comment).findOneByOrFail({
      id: Number(id),
    })

    return ResponseUtil.sendResponse<Comment>(res, "Fetch comment successfully", cmt)
  }

  static async update(req: Request, res: Response) {
    try {
      // @ts-ignore
      const userId = req.user.id
      const commentData: any = req.body
      const commentId = commentData.id
      if (!commentId) {
        return ResponseUtil.sendError(res, "Missing input id comment", 404, "")
      }
      if (!commentData.content) {
        return ResponseUtil.sendError(res, "Missing input content", 404, "")
      }
      const comment = await AppDataSource.getRepository(Comment)
        .createQueryBuilder("comment")
        .where("comment.id = :id AND comment.userId = :userId", { id: commentId, userId: userId })
        .getOne()
      if (!comment) {
        return ResponseUtil.sendError(res, "Comment not found or user invalid", 401, "")
      }

      const commentUpdated = await AppDataSource.getRepository(Comment)
        .createQueryBuilder()
        .update(Comment)
        .set({ content: commentData.content })
        .where("id = :id", { id: commentId })
        .execute()

      const notification = new Notification()
      //@ts-ignore
      notification.notification = `"${req.user.username}" sửa bình luận "${comment.content}" thành "${commentData.content}".`
      notification.userId = userId
      notification.commentsId = commentId
      const notificationData = await AppDataSource.getRepository(Notification)
      await notificationData.save(notification)

      return ResponseUtil.sendResponse(res, "Update comment success", commentUpdated)
    } catch (error: any) {
      console.error(error.message)
      return ResponseUtil.sendError(res, error.message, 500, "")
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      // @ts-ignore
      const userId = req.user.id
      const commentId = parseInt(req.params.id)

      const commentRepo = AppDataSource.getRepository(Comment)
      const comment = await commentRepo
        .createQueryBuilder("comment")
        .where("comment.id = :id AND comment.userId = :userId", { id: commentId, userId: userId })
        .getOne()
      if (!comment) {
        return ResponseUtil.sendError(res, "Comment not found or user invalid", 401, "")
      }
      await commentRepo.remove(comment)

      const notification = new Notification()
      //@ts-ignore
      notification.notification = `"${req.user.username}" đã xoá bình luận "${comment.content}" thành công.`
      notification.userId = userId
      const notificationData = await AppDataSource.getRepository(Notification)
      await notificationData.save(notification)

      return ResponseUtil.sendResponse(res, "Delete comment success", comment)
    } catch (error: any) {
      console.error(error.message)
      return ResponseUtil.sendError(res, error.message, 500, "")
    }
  }
}

export default CommentController

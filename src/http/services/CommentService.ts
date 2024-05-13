import { AppDataSource } from "@/database/data-source"
import { Comment } from "@/database/entities/Comment"
import { validateOrReject } from "class-validator"
import { CreateCommentDto } from "../dtos/CommentDTO"
import { Like } from "typeorm"
import { Paginator } from "@/database/Paginator"
import { UserService } from "./UserService"
export class CommentService {
  static async createComment(data: any): Promise<{}> {
    const parentCommentId = data.parent
    const repo = AppDataSource.getRepository(Comment)
    if (parentCommentId) {
      const check = await repo.findOne({ where: { id: Number(parentCommentId) } })
      if (!check) throw new Error("Parent comment not found")
    }
    const dto = new CreateCommentDto()
    Object.assign(dto, data)
    await validateOrReject(dto)
    console.log(data)
    const createdComment = await repo.query(
      `insert into comments (content, blogPostId, userId${parentCommentId ? ",parentComment" : ""}) values ('${
        data.content
      }',${data.blogPostId},${data.userId}${parentCommentId ? "," + parentCommentId : ""})`
    )
    // const createdComment = await repo.save(newComment);
    const userInfo = await UserService.getUserById(data.userId)
    return {
      ...createdComment,
      user: {
        id: userInfo.id,
        name: userInfo.username,
        email: userInfo.email,
      },
    }
  }

  static async getComments(queryParams: any): Promise<{ commentDatas: any[]; pageInfo: any }> {
    // Get the repository for the BlogPost entity
    const repo = AppDataSource.getRepository(Comment)
    console.log(queryParams)
    try {
      // Extract pagination parameters from queryParams
      const { pageSize, pageNumber, isAll, ...searchParams } = queryParams

      // Initialize where clause for filtering
      let whereClause: any = {}

      // Process searchParams for filtering
      if (searchParams) {
        for (const key in searchParams) {
          if (searchParams.hasOwnProperty(key)) {
            // Apply filtering using TypeORM's Like operator
            whereClause[key] = Like(`%${searchParams[key]}%`)
          }
        }
      }
      let comments: Comment[]
      let commentDatas: any[] = []
      let pageInfo: any = null

      // Construct queryBuilder with where clause
      const queryBuilder = repo
        .createQueryBuilder("comments")
        .leftJoinAndSelect("comments.user", "user")
        .select(["comments", "user.id", "user.username", "user.imgUrl"])
        .leftJoinAndSelect("comments.blogPost", "blogPost")
        .leftJoinAndSelect("blogPost.category", "category")
        .where(whereClause)
      if (isAll) {
        // Paginate if isAll is false
        const repo = AppDataSource.getRepository(Comment)
        commentDatas = await queryBuilder.getMany()
        pageInfo = null
        return { commentDatas, pageInfo }
      } else {
        // Fetch all posts if isAll is true
        const { records, paginationInfo } = await Paginator.paginate(queryBuilder, queryParams)
        commentDatas = records.map((comment) => ({
          ...comment,
          user: {
            id: comment.user.id,
            username: comment.user.username,
            email: comment.user.email,
            image: comment.user.imgUrl,
          },
        }))

        pageInfo = paginationInfo
        return { commentDatas, pageInfo }
      }
    } catch (error) {
      // Handle errors
      throw new Error("Error occurred while fetching blog posts" + error)
    }
  }
  static async getCommentByPostId(postId: number): Promise<any> {
    try {
      const repo = AppDataSource.getRepository(Comment)
      // const comment = await repo.query(`SELECT comments.*, users.username, users.imgUrl AS user_img
      // FROM comments
      // INNER JOIN users ON comments.userId = users.id
      // WHERE comments.blogpostid = ${postId};`)

      const comment = await repo
        .createQueryBuilder("comments")
        .innerJoinAndSelect("comments.user", "user")
        .select(["comments", "user.id", "user.username", "user.imgUrl"])
        .where("comments.blogpostid = :postId", { postId })
        .orderBy("comments_id", "DESC")
        .getRawMany()
      // console.log("comment", comment)
      if (!comment) {
        throw new Error("Comment not found")
      }
      return comment
    } catch (error: any) {
      throw new Error("Error while getting comment by id: " + error.message)
    }
  }
}

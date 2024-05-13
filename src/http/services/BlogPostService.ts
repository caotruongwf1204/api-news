import { BlogPost } from "../../database/entities/BlogPost"
import { AppDataSource } from "@/database/data-source"
import { CreateBlogPost, UpdateBlogPost } from "../dtos/BlogPostDTO"
import { validateOrReject } from "class-validator"
import { Paginator } from "@/database/Paginator"
import { Like } from "typeorm"
import { CommentService } from "./CommentService"
import { Category } from "@/database/entities/Category"
import { Between } from "typeorm"

export class BlogPostService {
  static async createBlogPost(blogData: CreateBlogPost): Promise<BlogPost> {
    // Validate the incoming data
    await validateOrReject(blogData)

    // Check if the blog title already exists
    const repo = AppDataSource.getRepository(BlogPost)
    const existingBlog = await repo.findOne({ where: { title: blogData.title } })
    if (existingBlog) {
      throw new Error("Title already exists")
    }

    // Create a new blog post entity
    const newBlog = repo.create(blogData)

    // Save the new blog post to the database
    await repo.save(newBlog)

    return newBlog
  }

  static async getBlogById(id: number): Promise<{}> {
    // Get the repository for the BlogPost entity
    const repo = AppDataSource.getRepository(BlogPost)
    let postDatas = {}
    try {
      // Find the blog post by ID
      const blog = await repo.findOneOrFail({ where: { id }});
      const comments = await CommentService.getCommentByPostId(blog.id)
      // console.log(comments)
      const cate = await AppDataSource.getRepository(Category).findOne({ where: { id: blog.categoryId } })
      //@ts-ignore
      postDatas = { ...blog, category: { id: cate.id, name: cate.name }, comments: comments }
      return postDatas
    } catch (error) {
      // If the blog post is not found, throw an error
      //@ts-ignore
      throw new Error("An error occured:", error)
    }
  }

  static async getPosts(queryParams: any): Promise<{ postDatas: any[]; pageInfo: any }> {
    // Get the repository for the BlogPost entity
    const repo = AppDataSource.getRepository(BlogPost)
    console.log(queryParams)
    try {
      // Extract pagination parameters from queryParams
      const { pageSize, pageNumber, isAll, startDate, endDate, ...searchParams } = queryParams

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

      if (startDate && endDate) {
        whereClause.createdAt = Between(startDate, endDate)
      }
      let posts: BlogPost[]
      let postDatas: any[] = []
      let pageInfo: any = null

      // Construct queryBuilder with where clause
      const queryBuilder = repo
        .createQueryBuilder("blogPost")
        .innerJoinAndSelect("blogPost.category", "category", "blogPost.categoryId = category.id")
        .innerJoinAndSelect("blogPost.user","user", "blogPost.userId = user.id")
        .select(["blogPost", "category.id", "category.name", "user.id", "user.username"])
        .where(whereClause)
      // .orderBy("blogPost.id", "DESC")

      if (!isAll) {
        // Paginate if isAll is false
        const { records, paginationInfo } = await Paginator.paginate(queryBuilder, queryParams)
        posts = records
        for (let item of posts) {
          const comments = await CommentService.getCommentByPostId(item.id)
          // const cate = await AppDataSource.getRepository(Category).findOne({where: {id:item.categoryId}})
          //@ts-ignore
          postDatas.push({ ...item, comments: comments })
        }
        pageInfo = paginationInfo
        return { postDatas, pageInfo }
      } else {
        // Fetch all posts if isAll is true
        posts = await queryBuilder.getMany()
        for (let item of posts) {
          const comments = await CommentService.getCommentByPostId(item.id)
          // const cate = await AppDataSource.getRepository(Category).findOne({ where: { id: item.categoryId } })
          //@ts-ignore
          postDatas.push({ ...item, comments: comments })
        }
        return { postDatas, pageInfo }
      }
    } catch (error) {
      // Handle errors
      throw new Error("Error occurred while fetching blog posts" + error)
    }
  }

  static async updateBlog(id: number, blogData: UpdateBlogPost): Promise<BlogPost> {
    // Get the repository for the BlogPost entity
    const repo = AppDataSource.getRepository(BlogPost)

    try {
      // Find the blog post by ID
      const blog = await repo.findOneOrFail({ where: { id } })

      // Update the blog post entity with new data
      Object.assign(blog, blogData)
      console.log(blogData)
      // Validate the updated data
      await validateOrReject(blog)

      // Save the updated blog post to the database
      await repo.save(blog)

      return blog
    } catch (error) {
      // Handle errors
      throw new Error("Error occurred while updating blog post")
    }
  }

  static async deleteBlog(id: number): Promise<void> {
    // Get the repository for the BlogPost entity
    const repo = AppDataSource.getRepository(BlogPost)

    try {
      // Find the blog post by ID
      const blog = await repo.findOneOrFail({ where: { id } })

      // If blog post is not found, throw an error
      if (!blog) {
        throw new Error("Blog post not found")
      }

      // Delete the blog post from the database
      await repo.remove(blog)
    } catch (error) {
      // Handle errors
      throw new Error("Error occurred while deleting blog post")
    }
  }
}

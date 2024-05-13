import { Request, Response } from "express"
import { ResponseUtil } from "@/utils/Response"
import { BlogPostService } from "../services/BlogPostService"
import { Paginator } from "@/database/Paginator"
import { Category } from "@/database/entities/Category"
import { FileUploader } from "../middlewares/FileUploader"
import { File } from "@/database/entities/File"
import { CreateBlogPost } from "../dtos/BlogPostDTO"
import { validateOrReject } from "class-validator"
import { AppDataSource } from "@/database/data-source"
import { BlogPost } from "@/database/entities/BlogPost"
import { Tag } from "@/database/entities/Tag"

export class BlogPostController {
  // them bai viet
  static async addBlog(req: Request, res: Response) {
    const blogData = req.body

    const isValidUrl = (url) => {
      if (url === null || url === undefined) {
        return true;
    }
      const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/
      return urlRegex.test(url)
    }
    if (!isValidUrl(blogData.imgUrl)) {
      return res.status(400).json({ message: "imUrl không hợp lệ" })
    }
    const check = await AppDataSource.getRepository(Category).findOneByOrFail({ id: blogData.categoryId })
    if (!check) return res.status(404).json({ message: `Category ${blogData.categoryId} not found!` })
    const blog = await BlogPostService.createBlogPost(blogData)
    ResponseUtil.sendResponse(res, "Create post successfully", blog)
  }

  //lay bai viet theo id
  static async getBlogById(req: Request, res: Response) {
    try {
      const { id } = req.params
      const blog = await BlogPostService.getBlogById(Number(id))
      ResponseUtil.sendResponse(res, "Fetch blog successfully", blog)
    } catch (error) {
      console.error("Error occurred while fetching blog by ID:", error)
      ResponseUtil.sendResponse(res, "Error occurred while fetching blog by ID", null, 500)
    }
  }

  //lay tat ca bai viet
  static async getPosts(req: Request, res: Response) {
    try {
      const posts = await BlogPostService.getPosts(req.body)
      ResponseUtil.sendResponse(res, "Fetched blog successfully", posts.postDatas, posts.pageInfo)
    } catch (error) {
      console.error("Error occurred while fetching blogs:", error)
      ResponseUtil.sendResponse(res, "Error occurred while fetching blogs", null, 500)
    }
  }

  static async updateBlog(req: Request, res: Response) {
    try {
      const { id } = req.params
      const blogData = req.body
      const result = await BlogPostService.updateBlog(Number(id), blogData)
      ResponseUtil.sendResponse(res, "Successfully updated the blog", result)
    } catch (error) {
      console.error("Error occurred while updating blog:", error)
      ResponseUtil.sendResponse(res, "Error occurred while updating blog", null, 500)
    }
  }

  static async updateMultipleBlog(req: Request, res: Response) {
    try {
      const arrayId = req.body.arrayId
      const status = req.body.status
      const results: BlogPost[] = []

      const blogRepository = AppDataSource.getRepository(BlogPost)

      for (const id of arrayId) {
        // Tìm bài viết trong cơ sở dữ liệu
        let blog = await blogRepository.findOne({ where: { id } })

        if (!blog) {
          res.status(404).json(`Blog with id ${id} not found`)
          continue
        }
        // Cập nhật trạng thái của bài viết
        blog = { ...blog, status }
        // Lưu bài viết đã cập nhật vào cơ sở dữ liệu
        await blogRepository.save(blog)
        results.push(blog)
      }

      ResponseUtil.sendResponse(res, "Successfully updated the blogs", results)
    } catch (error) {
      console.error("Error occurred while updating blogs:", error)
      ResponseUtil.sendResponse(res, "Error occurred while updating blogs", null, 500)
    }
  }

  static async deleteBlog(req: Request, res: Response) {
    try {
      const { id } = req.params
      const result = await BlogPostService.deleteBlog(Number(id))
      ResponseUtil.sendResponse(res, "Successfully deleted the blog", result)
    } catch (error) {
      console.error("Error occurred while deleting blog:", error)
      ResponseUtil.sendResponse(res, "Error occurred while deleting blog", null, 500)
    }
  }
  static async addTagToPost(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { tags } = req.body
      const repo = AppDataSource.getRepository(Tag)
      for (let item of tags) {
        const tag = await repo.findOne({ where: { name: item } })
        //@ts-ignore
        await repo.query(`insert into blogpost_tag (blogPostId, tagsId) values (${tag.id},${id}) `)
      }
      return res.status(200).json({ message: "Add tag successfull!", data: tags })
    } catch (error) {
      console.log(error)
    }
  }
  static async getTagOfPost(req: Request, res: Response) {
    try {
      const { id } = req.params
      const repo = AppDataSource.getRepository(Tag)
      const data = await repo.query(
        `SELECT blog_post.id as blogPostId, GROUP_CONCAT(tags.name) as tags from tags INNER JOIN blogpost_tag on tags.id = blogpost_tag.tagsId INNER JOIN blog_post on blogpost_tag.blogPostId = blog_post.id WHERE blog_post.id =${id} GROUP BY blog_post.id`
      )
      const tags = data[0].tags.split(",")
      return res
        .status(200)
        .json({ message: "Get tags successfull!", data: { blogPostId: data[0].blogPostId, tags: tags } })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ error: error })
    }
  }
}

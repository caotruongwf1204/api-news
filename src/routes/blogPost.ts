import express from "express"
import { ErrorHandler } from "../http/middlewares/ErrorHandler"
import { BlogPostController } from "../http/controllers/BlogPostController"
import { AuthMiddleware } from "@/http/middlewares/AuthMiddleware"
import { PermissionType } from "@/constants/Role"
// import { AdminMiddleware } from "@/http/middlewares/AdminMiddleware"
const router = express.Router()

router.get("/:id", 
  // ErrorHandler.catchErrors(AuthMiddleware.authenticate),
  // ErrorHandler.catchErrors(AuthMiddleware.authorize("article_view")),
  ErrorHandler.catchErrors(BlogPostController.getBlogById))
router.post("/get-posts", 
  // ErrorHandler.catchErrors(AuthMiddleware.authenticate),
  // ErrorHandler.catchErrors(AuthMiddleware.authorize("article_view")),
  ErrorHandler.catchErrors(BlogPostController.getPosts)
)
router.post(
  "/create",
  ErrorHandler.catchErrors(AuthMiddleware.authenticate),
  // ErrorHandler.catchErrors(AuthMiddleware.authorize(PermissionType.ARTICLE_CREATE)),
  ErrorHandler.catchErrors(BlogPostController.addBlog),
)
router.patch(
  "/update/:id",
  ErrorHandler.catchErrors(AuthMiddleware.authenticate),
  ErrorHandler.catchErrors(AuthMiddleware.authorize(PermissionType.ARTICLE_EDIT)),
  ErrorHandler.catchErrors(BlogPostController.updateBlog),
)

router.patch(
  "/update",
  ErrorHandler.catchErrors(AuthMiddleware.authenticate),
  // ErrorHandler.catchErrors(AuthMiddleware.authorize(PermissionType.ARTICLE_EDIT)),
  ErrorHandler.catchErrors(BlogPostController.updateMultipleBlog),
)

router.delete(
  "/delete/:id",
  ErrorHandler.catchErrors(AuthMiddleware.authenticate),
  ErrorHandler.catchErrors(AuthMiddleware.authorize(PermissionType.ARTICLE_DELETE)),
  ErrorHandler.catchErrors(BlogPostController.deleteBlog),
)
router.post(
  "/tags/:id",
  ErrorHandler.catchErrors(BlogPostController.addTagToPost)
)
router.get(
  "/tags/:id",
  ErrorHandler.catchErrors(BlogPostController.getTagOfPost)
)
export default router

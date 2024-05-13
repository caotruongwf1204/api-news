import express from "express"
import { ErrorHandler } from "../http/middlewares/ErrorHandler"
import { CategoryController } from "@/http/controllers/CategoryController"
import { AuthMiddleware } from "@/http/middlewares/AuthMiddleware"

const router = express.Router()
router.get("/",
  // ErrorHandler.catchErrors(AuthMiddleware.authenticate),
  // ErrorHandler.catchErrors(AuthMiddleware.authorize("category_view")),
  ErrorHandler.catchErrors(CategoryController.getCategory))
router.get("/:id",
  // ErrorHandler.catchErrors(AuthMiddleware.authenticate),
  // ErrorHandler.catchErrors(AuthMiddleware.authorize("category_view")),
  ErrorHandler.catchErrors(CategoryController.getCategoryById))
router.post(
  "/create",
  ErrorHandler.catchErrors(AuthMiddleware.authenticate),
  // ErrorHandler.catchErrors(AuthMiddleware.authorize("category_create")),
  ErrorHandler.catchErrors(CategoryController.createCategory),
)
router.patch(
  "/update/:id",
  ErrorHandler.catchErrors(AuthMiddleware.authenticate),
  ErrorHandler.catchErrors(AuthMiddleware.authorize("category_edit")),
  ErrorHandler.catchErrors(CategoryController.updateCategory),
)
router.delete(
  "/delete/:id",
  ErrorHandler.catchErrors(AuthMiddleware.authenticate),
  ErrorHandler.catchErrors(AuthMiddleware.authorize("category_delete")),
  ErrorHandler.catchErrors(CategoryController.deleteCategory),
)

export default router

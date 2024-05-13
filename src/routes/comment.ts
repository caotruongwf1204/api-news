import { CommentController } from "@http/controllers/CommentController"
import { AuthMiddleware } from "@http/middlewares/AuthMiddleware"
import { ErrorHandler } from "@http/middlewares/ErrorHandler"
import express from "express"

const commentRouter = express.Router()

commentRouter.post("/", 
  // ErrorHandler.catchErrors(AuthMiddleware.authenticate),
  // ErrorHandler.catchErrors(AuthMiddleware.authorize('comment_view')),
  ErrorHandler.catchErrors(CommentController.get)
)
commentRouter.get("/:id", 
  // ErrorHandler.catchErrors(AuthMiddleware.authenticate),
  // ErrorHandler.catchErrors(AuthMiddleware.authorize('comment_view')),
  ErrorHandler.catchErrors(CommentController.getById)
)
commentRouter.post(
  "/create",
  ErrorHandler.catchErrors(AuthMiddleware.authenticate),
  // ErrorHandler.catchErrors(AuthMiddleware.authorize('comment_create')),
  ErrorHandler.catchErrors(CommentController.create)
)
commentRouter.patch(
  "/update/:id",
  ErrorHandler.catchErrors(AuthMiddleware.authenticate),
  // ErrorHandler.catchErrors(AuthMiddleware.authorize('comment_edit')),
  ErrorHandler.catchErrors(CommentController.update)
)
commentRouter.delete(
  "/delete/:id",
  ErrorHandler.catchErrors(AuthMiddleware.authenticate),
  // ErrorHandler.catchErrors(AuthMiddleware.authorize('comment_delete')),
  ErrorHandler.catchErrors(CommentController.delete)
)

export default commentRouter

import { TagController } from "@http/controllers/TagController"
import { AdminMiddleware } from "@http/middlewares/AdminMiddleware"
import { AuthMiddleware } from "@http/middlewares/AuthMiddleware"
import { ErrorHandler } from "@http/middlewares/ErrorHandler"
import express from "express"

const tagRoute = express.Router()

tagRoute.get("/", 
ErrorHandler.catchErrors(AuthMiddleware.authenticate),
ErrorHandler.catchErrors(AuthMiddleware.authorize("tag_view")),
ErrorHandler.catchErrors(TagController.getTags))
tagRoute.get("/:id", 
ErrorHandler.catchErrors(AuthMiddleware.authenticate),
ErrorHandler.catchErrors(AuthMiddleware.authorize("tag_view")),
ErrorHandler.catchErrors(TagController.getTagById))
tagRoute.post(
  "/",
  ErrorHandler.catchErrors(AuthMiddleware.authenticate),
  ErrorHandler.catchErrors(AuthMiddleware.authorize("tag_create")),
  ErrorHandler.catchErrors(TagController.create)
)
tagRoute.post(
  "/create",
  ErrorHandler.catchErrors(AuthMiddleware.authenticate),
  ErrorHandler.catchErrors(AuthMiddleware.authorize("tag_create")),
  ErrorHandler.catchErrors(TagController.createMultipleTags)
)

tagRoute.patch(
  "/update/:id",
  ErrorHandler.catchErrors(AuthMiddleware.authenticate),
  ErrorHandler.catchErrors(AuthMiddleware.authorize("tag_edit")),
  ErrorHandler.catchErrors(TagController.updateTag)
)
tagRoute.delete(
  "/delete",
  ErrorHandler.catchErrors(AuthMiddleware.authenticate),
  ErrorHandler.catchErrors(AuthMiddleware.authorize("tag_delete")),
  ErrorHandler.catchErrors(TagController.deleteMultipleTags)
)

tagRoute.delete(
  "/delete/:id",
  ErrorHandler.catchErrors(AuthMiddleware.authenticate),
  ErrorHandler.catchErrors(AuthMiddleware.authorize("tag_delete")),
  ErrorHandler.catchErrors(TagController.deleteTag)
)



export default tagRoute

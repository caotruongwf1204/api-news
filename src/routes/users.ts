import { UserController } from "@/http/controllers/UserController"
import { AuthController } from "@/http/controllers/AuthController"
import { AdminMiddleware } from "@http/middlewares/AdminMiddleware"
import { AuthMiddleware } from "@http/middlewares/AuthMiddleware"
import { ErrorHandler } from "@http/middlewares/ErrorHandler"
import { FileUploader } from "@http/middlewares/FileUploader"
import express from "express"

const router = express.Router()
router.post("/register", ErrorHandler.catchErrors(AuthController.register))
router.post("/login", ErrorHandler.catchErrors(AuthController.login))
router.post(
  "/get-users",
  ErrorHandler.catchErrors(AuthMiddleware.authenticate),
  // ErrorHandler.catchErrors(AdminMiddleware.check),
  ErrorHandler.catchErrors(UserController.getUsers)
)
router.get(
  "/:id",
  // ErrorHandler.catchErrors(AuthMiddleware.authenticate),
  // ErrorHandler.catchErrors(AuthMiddleware.authorize("viewUser")),
  ErrorHandler.catchErrors(UserController.getUsers)
)
// router.get("/:id", ErrorHandler.catchErrors(UserController.getUsers));
router.post(
  "/",
  ErrorHandler.catchErrors(AuthMiddleware.authenticate),
  // ErrorHandler.catchErrors(AdminMiddleware.check),
  // FileUploader.upload("image", "users", 2 * 1024 * 1024),
  ErrorHandler.catchErrors(UserController.create)
)
router.patch(
  "/:id",
  ErrorHandler.catchErrors(AuthMiddleware.authenticate),
  // ErrorHandler.catchErrors(AdminMiddleware.check),
  ErrorHandler.catchErrors(UserController.update)
)
router.delete(
  "/:id",
  ErrorHandler.catchErrors(AuthMiddleware.authenticate),
  // ErrorHandler.catchErrors(AdminMiddleware.check),
  ErrorHandler.catchErrors(UserController.delete)
)
router.post(
  "/create-role",
  ErrorHandler.catchErrors(AuthMiddleware.authenticate),
  ErrorHandler.catchErrors(UserController.createRole)
)


export default router

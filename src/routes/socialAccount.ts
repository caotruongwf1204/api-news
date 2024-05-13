import { SocialAccountController } from "@http/controllers/SocialAccountController"
import { AdminMiddleware } from "@http/middlewares/AdminMiddleware"
import { AuthMiddleware } from "@http/middlewares/AuthMiddleware"
import { ErrorHandler } from "@http/middlewares/ErrorHandler"

import express from "express"

const socialAccountRoute = express.Router()

socialAccountRoute.get("/", ErrorHandler.catchErrors(SocialAccountController.getAccount))
socialAccountRoute.get("/:id", ErrorHandler.catchErrors(SocialAccountController.getAccountById))
socialAccountRoute.post(
  "/create",
  ErrorHandler.catchErrors(AuthMiddleware.authenticate),
  ErrorHandler.catchErrors(SocialAccountController.create)
)
socialAccountRoute.patch(
  "/update/:id",
  ErrorHandler.catchErrors(AuthMiddleware.authenticate),
  ErrorHandler.catchErrors(SocialAccountController.update)
)
socialAccountRoute.delete(
  "/delete/:id",
  ErrorHandler.catchErrors(AuthMiddleware.authenticate),
  ErrorHandler.catchErrors(SocialAccountController.delete)
)

export default socialAccountRoute

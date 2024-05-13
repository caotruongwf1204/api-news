import express from "express"
import { ErrorHandler } from "../http/middlewares/ErrorHandler"
import { AuthMiddleware } from "@/http/middlewares/AuthMiddleware"
import { MenuController } from "@/http/controllers/MenuController"
const router = express.Router()

router.get("/", 
ErrorHandler.catchErrors(AuthMiddleware.authenticate),
ErrorHandler.catchErrors(AuthMiddleware.authorize("admin")),
ErrorHandler.catchErrors(MenuController.getMenu)
)

export default router

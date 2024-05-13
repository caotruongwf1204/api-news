import { AuthController } from "@/http/controllers/AuthController"
import { AuthMiddleware } from "@/http/middlewares/AuthMiddleware"
import { ErrorHandler } from "@http/middlewares/ErrorHandler"
import express from "express"

const router = express.Router()
router.post("/refresh-token", AuthController.refreshToken)
router.post("/register", ErrorHandler.catchErrors(AuthController.register))
router.post("/login", ErrorHandler.catchErrors(AuthController.login))

router.post(
  "/logout",
  // ErrorHandler.catchErrors(AuthMiddleware.authenticate),
  ErrorHandler.catchErrors(AuthController.logout)
)
router.get(
  "/roles",
  ErrorHandler.catchErrors(AuthMiddleware.authenticate),
  ErrorHandler.catchErrors(AuthController.getRole)
)

router.post(
  "/roles",
  ErrorHandler.catchErrors(AuthMiddleware.authenticate),
  ErrorHandler.catchErrors(AuthController.addRole)
)

router.patch(
  "/roles/:id",
  ErrorHandler.catchErrors(AuthMiddleware.authenticate),
  ErrorHandler.catchErrors(AuthController.updateRole)
)

router.delete(
    "/roles/:id",
    ErrorHandler.catchErrors(AuthMiddleware.authenticate),
    ErrorHandler.catchErrors(AuthController.deleteRole)
  )

router.get(
  "/permissions",
  ErrorHandler.catchErrors(AuthMiddleware.authenticate),
  ErrorHandler.catchErrors(AuthController.getAllPermission)
)

router.post(
    "/role-permissions",
    ErrorHandler.catchErrors(AuthMiddleware.authenticate),
    ErrorHandler.catchErrors(AuthController.setRolePermission)
  )

export default router

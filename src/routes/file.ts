import express, { Request, Response } from "express"
import { upload } from "@/utils/MulterConfig"
import { FileController } from "@/http/controllers/FileController"
import { ErrorHandler } from "@/http/middlewares/ErrorHandler"
import { AuthMiddleware } from "@/http/middlewares/AuthMiddleware"

const router = express.Router()

router.post(
  "/upload",
  ErrorHandler.catchErrors(AuthMiddleware.authenticate),
  upload.single("file"),
  FileController.uploadFile
)

router.patch(
  "/update/:id",
  ErrorHandler.catchErrors(AuthMiddleware.authenticate),
  ErrorHandler.catchErrors(FileController.updateFile)
)

router.delete(
  "/delete",
  ErrorHandler.catchErrors(AuthMiddleware.authenticate),
  ErrorHandler.catchErrors(FileController.deleteFile)
)

router.post(
  "/get-files",
  ErrorHandler.catchErrors(AuthMiddleware.authenticate),
  ErrorHandler.catchErrors(FileController.getFile)
)
router.post(
  "/folder",
  ErrorHandler.catchErrors(AuthMiddleware.authenticate),
  ErrorHandler.catchErrors(FileController.createFolder)
)
router.patch(
  "/folder/:id",
  ErrorHandler.catchErrors(AuthMiddleware.authenticate),
  ErrorHandler.catchErrors(FileController.updateFolder)
)
router.delete(
  "/folder/delete",
  ErrorHandler.catchErrors(AuthMiddleware.authenticate),
  ErrorHandler.catchErrors(FileController.deleteFolder)
)

router.post(
  "/folder/get-folders",
  ErrorHandler.catchErrors(AuthMiddleware.authenticate),
  ErrorHandler.catchErrors(FileController.getAllFolder)
)

router.get(
  "/folder/:id",
  ErrorHandler.catchErrors(AuthMiddleware.authenticate),
  ErrorHandler.catchErrors(FileController.getFolderbyId)
)

export default router

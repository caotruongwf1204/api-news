import { ContentController } from "@http/controllers/ContentController";
import { AuthMiddleware } from "@http/middlewares/AuthMiddleware";
import { ErrorHandler } from "@http/middlewares/ErrorHandler";
import express from "express";

const contentRouter = express.Router();

// Định nghĩa các endpoint cho API quản lý nội dung
contentRouter.get("/", ErrorHandler.catchErrors(ContentController.getContent));
contentRouter.get("/:id", ErrorHandler.catchErrors(ContentController.getContentById));
contentRouter.post(
    "/create",
    ErrorHandler.catchErrors(AuthMiddleware.authenticate),
    ErrorHandler.catchErrors(ContentController.create)
);
contentRouter.patch(
    "/update/:id",
    ErrorHandler.catchErrors(AuthMiddleware.authenticate),
    ErrorHandler.catchErrors(ContentController.update)
);
contentRouter.delete(
    "/detete/:id",
    ErrorHandler.catchErrors(AuthMiddleware.authenticate),

    ErrorHandler.catchErrors(ContentController.delete)
);

export default contentRouter;

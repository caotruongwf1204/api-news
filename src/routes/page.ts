import { PageController } from "@/http/controllers/PageController";
import { AuthMiddleware } from "@http/middlewares/AuthMiddleware";
import { ErrorHandler } from "@http/middlewares/ErrorHandler";
import express from "express";

const pageController = express.Router();

// Định nghĩa các endpoint cho API quản lý nội dung
pageController.get("/", ErrorHandler.catchErrors(PageController.getPage));
pageController.get("/:id", ErrorHandler.catchErrors(PageController.getPageById));
pageController.post(
    "/create",
    ErrorHandler.catchErrors(AuthMiddleware.authenticate),
    ErrorHandler.catchErrors(PageController.createPage)
);
pageController.patch(
    "/update/:id",
    ErrorHandler.catchErrors(AuthMiddleware.authenticate),
     ErrorHandler.catchErrors(PageController.updatePage)
);
pageController.delete(
    "/delete/:id",
    ErrorHandler.catchErrors(AuthMiddleware.authenticate),

    ErrorHandler.catchErrors(PageController.deletePage)
);

export default pageController;

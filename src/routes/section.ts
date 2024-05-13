import express  from "express";
import { ErrorHandler } from "@/http/middlewares/ErrorHandler";
import { SectionController } from "@/http/controllers/SectionController";
import { AuthMiddleware } from "@/http/middlewares/AuthMiddleware";


const router = express.Router()

router.get("/", ErrorHandler.catchErrors(SectionController.getSection));
router.get("/:id", ErrorHandler.catchErrors(SectionController.getSectionById));
router.post("/create", 
ErrorHandler.catchErrors(AuthMiddleware.authenticate),
ErrorHandler.catchErrors(SectionController.createSection)
);

router.patch("/update/:id", 
ErrorHandler.catchErrors(AuthMiddleware.authenticate),
ErrorHandler.catchErrors(SectionController.updateSection)
);
router.delete("/delete/:id", 
ErrorHandler.catchErrors(AuthMiddleware.authenticate),
ErrorHandler.catchErrors(SectionController.deleteSection)
);

export default router;
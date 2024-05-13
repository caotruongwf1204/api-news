import EmailController from "@/http/controllers/MailController"
import { ErrorHandler } from "@/http/middlewares/ErrorHandler"
import express from "express"



const router = express.Router()

router.post('/send-email', ErrorHandler.catchErrors(EmailController.SendMail))

export default router
import nodemailer, { Transporter } from "nodemailer"
import { Request, Response } from "express"
import * as dotenv from "dotenv"
dotenv.config()

export default class EmailController {
  static async SendMail(req: Request, res: Response) {
    const formData = req.body
    console.log("=======", formData)

    try {
      // Tạo một transporter để gửi email
      const transporter: Transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // false nếu sử dụng TLS
        auth: {
          user: "nguyenducquystu@gmail.com",
          pass: "avqp jsaq zepz zngw",
        },
      })
      const textContent = Object.entries(formData.text)
        .map(([key, value]) => `${key}: ${value}`)
        .join("\n")
      const attachments = formData.attachments.map((attachment: any) => ({
        filename: attachment.filename,
        path: attachment.path,
      }))
      // Tạo một đối tượng email
      const mailOptions = {
        from: "nguyenducquystu@gmail.com",
        to: "caodinhtruong1204@gmail.com",
        subject: formData.subject,
        text: textContent,
        attachments: attachments,
      }

      // Gửi email
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error occurred:", error)
          res.status(500).send("Error occurred while sending email")
        } else {
          console.log("Email sent:", info.response)
          res.status(200).send({ masage: "Email sent successfully"})
        }
      })
    } catch (error) {
      console.error("Error occurred:", error)
      res.status(500).send("Error occurred while sending email")
    }
  }
}

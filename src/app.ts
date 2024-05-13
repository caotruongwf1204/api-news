
import express, { Express, Request, Response } from "express";
import { ErrorHandler } from "./http/middlewares/ErrorHandler";
import bodyParser from "body-parser";
import cors from "cors";
import blogRoute from "./routes/blogPost"
import sectionRoute from "./routes/section"
import tagRoute from "./routes/tag";
import userRoute from "./routes/users";
import authRoute from "./routes/auth";
import commentRouter from "./routes/comment";
import contentRouter from "./routes/content";
import categoryRouter from "./routes/category";
import fileRoute from "./routes/file"
import pageRoute from "./routes/page";
import socialAccountRoute from "./routes/socialAccount";
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from '../swagger';
import path from "path"
import menuRoute from "./routes/menu";
import emailRoute from "./routes/sendMail";

import { refreshTokenMiddleware } from "./http/middlewares/RefreshTokenMiddleware";
const app: Express = express()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use("/public/uploads", express.static(path.join(__dirname, "../public/uploads")))

// Sử dụng middleware làm mới token cho tất cả các route cần làm mới token
app.use(refreshTokenMiddleware)
app.use("/socialAccount", socialAccountRoute);
app.use("/posts", blogRoute)
app.use("/section", sectionRoute)
app.use("/tags", tagRoute);
app.use("/user", userRoute);
app.use("/auth", authRoute);
app.use("/category", categoryRouter);
app.use("/comment", commentRouter);
app.use("/content", contentRouter);
app.use("/file", fileRoute)
app.use("/page", pageRoute)
app.use("/email", emailRoute)
// app.get("/images/:type/:id", imageController.get);
app.use("/menu", menuRoute)
app.get('/check', (req, res) => {
  res.status(200).send('Server is healthy!');
});
// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("*", (req: Request, res: Response) => {
  return res.status(404).json({
    success: false,
    message: "Invalid route",
  })
})

app.use(ErrorHandler.handleErrors)

export default app

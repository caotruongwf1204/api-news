import { AppDataSource } from "@/database/data-source"
import * as dotenv from "dotenv"
import "reflect-metadata"
import { createServer } from "http"
import { Server } from "socket.io"
import app from "@/app"
import commentHandler from "./http/controllers/socket/commentHandler"
import likeHandler from "./http/controllers/socket/likeHandler"
import shareHandler from "./http/controllers/socket/shareHandler"
import AuthSocket from "./http/middlewares/AuthSocket"
import createDefaultPermission from "./database/seeds/permissions"
import createDefaultMenu from "./database/seeds/menu"
import { createPost } from "./database/seeds/post"
import { useSocketService } from "./http/services/SocketService"
import notificationHandler from "./http/controllers/socket/notificationHandler"

dotenv.config()

const PORT = process.env.APP_PORT || 5000

//handle socket
const server = createServer(app)
const { io, emitCustomEvent } = useSocketService(server)
io.on("connection", (socket) => {
  commentHandler(socket, emitCustomEvent), notificationHandler(socket, emitCustomEvent)
})
AppDataSource.initialize()
  .then(async () => {
    console.log("Database connection success")
  })
  .then(() => {
    createDefaultPermission()
    createDefaultMenu()
  })
  .catch((err) => console.error(err))

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

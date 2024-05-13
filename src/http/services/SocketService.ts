import { Server } from "http"
import { eventNames } from "process"
import { Socket, Server as SocketIOServer } from "socket.io"

export const useSocketService = (server: Server) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: true,
    },
  })

  io.on("connection", (socket: Socket) => {
    console.log("New client connected")

    // Xử lý các sự kiện socket ở đây
    socket.on("disconnect", () => {
      console.log("Client disconnected")
    })
  })

  const emitCustomEvent = (eventName: string, data: any) => {
    io.emit(eventName, data)
  }

  const emitNotificationEvent = (eventName: string, data: any) => {
    io.emit(eventName, data)
  }

  return {
    io,
    emitCustomEvent,
    emitNotificationEvent
  }
}

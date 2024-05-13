import { AppDataSource } from "@/database/data-source"
import { Notification } from "@/database/entities/Notification"

function notificationHandler(socket, emitCustomEvent) {
  const updateNotificationData = async () => {
    const repo = AppDataSource.getRepository(Notification)
    const notifications = await repo.find({
      order: {
        id: "DESC"
      }})
    return emitCustomEvent("actionNotification", {
      code: 200,
      message: "action notification success",
      data: notifications,
    })
  }
  socket.on("notification:action", updateNotificationData)
}

export default notificationHandler

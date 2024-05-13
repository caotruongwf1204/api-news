import { AppDataSource } from "@/database/data-source";
import { BlogPostService } from "@/http/services/BlogPostService";
import { CommentService } from "@/http/services/CommentService";
import { Notification } from "@/database/entities/Notification"


function commentHandler(socket,emitCustomEvent) {
  //----them moi comment
  const updateCommentData = async(data) => {
    console.log('tạo comment');
    const blogs = await BlogPostService.getBlogById(data.blogId)
    const repo = AppDataSource.getRepository(Notification)
    const notifications = await repo.find({
      order: {
        id: "DESC"
      }})
    //lay ra id cua user
    emitCustomEvent("actionComment", {
      code: 200,
      message: "action comment success",
      data: blogs
    })
    
    emitCustomEvent("actionNoti", {
      code: 200,
      message: "action notification success",
      data: notifications,
    })
  }
  socket.on("comment:action", updateCommentData)
}

export default commentHandler;
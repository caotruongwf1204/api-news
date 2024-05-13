import { AppDataSource } from "@/database/data-source";
import { Comment } from "@/database/entities/Comment";

function shareHandler(io, socket){
  const createShare = async (id) => {
    try{
      console.log('payload: %s', id);
      const commentRepo = AppDataSource.getRepository(Comment);
      const commentUpdate = await commentRepo.createQueryBuilder()
      .update(Comment)
      .set({  shareCount: () => "shareCount + 1",})
      .where("id = :id", { id: id })
      .execute()
      if(commentUpdate.affected==0) {
        return socket.emit("createShare",{
          code: 400,
          message: "comment not found!"
        })
      }

      const comment = await commentRepo.createQueryBuilder("comment")
      .where("comment.id = :id", { id: id })
      .getOne()
      // Echo back the received message
      return socket.emit("createShare", {
        code: 200,
        message: comment
      });
    }catch(error: any){
      console.error(error.message)
      socket.emit("createShare",{
        code: 500,
        message: error.message
      })
    }
  }

  const readShare = async(id) => {
    try{
      console.log('payload: %s', id);
      const commentRepo = AppDataSource.getRepository(Comment);
      const comment = await commentRepo.createQueryBuilder("comment")
      .where("comment.id = :id", { id: id })
      .getOne()
      // Echo back the received message
      socket.emit("readShare",{status: "success", data: comment});
    }catch(error: any){
      console.error(error.message)
      socket.send(error.message)
    }
  }

  socket.on("share:create", createShare);
  socket.on("share:read", readShare);
}

export default shareHandler;
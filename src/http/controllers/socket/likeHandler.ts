import { AppDataSource } from "@/database/data-source";
import { Comment } from "@/database/entities/Comment";

function likeHandler(io, socket){
  const createLike = async (id) => {
    try{
      console.log('payload: %s', id);
      const commentRepo = AppDataSource.getRepository(Comment);
      const commentUpdate = await commentRepo.createQueryBuilder()
      .update(Comment)
      .set({  likeCount: () => "likeCount + 1",})
      .where("id = :id", { id: id })
      .execute()
      if(commentUpdate.affected==0) {
        return socket.emit("createLike",{
          code: 400,
          message: "comment not found!"
        })
      }

      const comment = await commentRepo.createQueryBuilder("comment")
      .where("comment.id = :id", { id: id })
      .getOne()
      // Echo back the received message
      return socket.emit("createLike", {
        code: 200,
        message: comment
      });
    }catch(error: any){
      console.error(error.message)
      socket.emit("createLike",{
        code: 500,
        message: error.message
      })
    }
  }

  const readLike = async(id) => {
    try{
      console.log('payload: %s', id);
      const commentRepo = AppDataSource.getRepository(Comment);
      const comment = await commentRepo.createQueryBuilder("comment")
      .where("comment.id = :id", { id: id })
      .getOne()
      // Echo back the received message
      socket.emit("readLike",{status: "success", data: comment});
    }catch(error: any){
      console.error(error.message)
      socket.send(error.message)
    }
  }

  //xoa like
  const deleteLike = async (id) => {
    try{
      console.log('payload: %s', id);
      const commentRepo = AppDataSource.getRepository(Comment);
      const commentUpdate = await commentRepo.createQueryBuilder()
      .update(Comment)
      .set({  likeCount: () => "CASE WHEN likeCount > 0 THEN likeCount - 1 ELSE likeCount END",})
      .where("id = :id", { id: id })
      .execute()
      if(commentUpdate.affected==0) {
        socket.emit("deleteLike",{
          code: 400,
          message: "comment not found!"
        })
      }
      const comment = await commentRepo.createQueryBuilder("comment")
      .where("comment.id = :id", { id: id })
      .getOne()

      socket.emit("deleteLike", {
        code: 200,
        message: comment
      });
    }catch(error: any){
      console.error(error.message)
      socket.emit("deleteLike",{
        code: 500,
        message: error.message
      })
    }
  }
  socket.on("like:create", createLike);
  socket.on("like:read", readLike);
  socket.on("like:delete", deleteLike);
}

export default likeHandler;
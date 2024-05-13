import { AppDataSource } from "@/database/data-source";
import { User } from "@/database/entities/User";
import jwt from "jsonwebtoken";

const AuthSocket = async(socket, next: any) => {
    const token = socket.handshake.headers.access_token;
    if (!token) {
      socket.emit("getError", "Missing token")
      next(new Error("Missing token"));
    }
    try {
      const decoded: any = await jwt.verify(token, process.env.ACCESS_KEY_SECRET || "secret123");
      const id = decoded.user.id
      const repo = AppDataSource.getRepository(User);
      const user = await repo.findOneByOrFail({ id });
      socket.user = user;
    } catch (error) {
      console.error(error);
      socket.emit("getError", "Invalid token")
      next(new Error("Invalid token"));
    }
    next();
}

export default AuthSocket
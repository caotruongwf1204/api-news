import { NextFunction, Request, Response } from "express"
import bcrypt from "bcryptjs"
import { AppDataSource } from "@/database/data-source"
import { User } from "@/database/entities/User"
import { AuthenticatedRequest } from "@/interface/common"
import { ValidationError, validateOrReject } from "class-validator"
import { CreateUserDto, RegisterDTO } from "../dtos/UserDTO"
import { tr } from "@faker-js/faker"
import { ResponseUtil } from "@/utils/Response"
import { Paginator } from "@/database/Paginator"
import { Role } from "@/database/entities/Role"
import { AuthService } from "../services/AuthService"
import { UserService } from "../services/UserService"

export class UserController {
  // Phương thức tạo người dùng mới
  static async create(req: Request, res: Response) {
    try {
      const userRepository = AppDataSource.getRepository(User)
      const userData = req.body

      if (!userData.password) {
        return res.status(400).json({ message: "Password is required" })
      }
      // Tạo một thể hiện của DTO CreateUserDto từ dữ liệu nhận được từ req.body
      const createUserDto = new CreateUserDto()
      createUserDto.username = userData.username
      createUserDto.email = userData.email
      createUserDto.password = userData.password
      createUserDto.imgUrl = userData.imgUrl

      // Validate DTO
      await validateOrReject(createUserDto)
      // Kiểm tra xem người dùng đã tồn tại chưa
      const existingUser = await userRepository.findOne({
        where: [{ email: createUserDto.email }, { username: createUserDto.username }],
      })
      if (existingUser) {
        return res.status(400).json({ message: "User already exists"})
      }

      // Tạo một đối tượng User mới
      const newUser = userRepository.create({
        username: createUserDto.username,
        email: createUserDto.email,
        password: createUserDto.password,
        imgUrl: createUserDto.imgUrl,
      })

      // Mã hóa mật khẩu trước khi lưu vào cơ sở dữ liệu
      const salt = await bcrypt.genSalt(10)
      newUser.password = await bcrypt.hash(createUserDto.password, salt)

      // Lưu người dùng mới vào cơ sở dữ liệu
      await userRepository.save(newUser)
      let newUserData = {}
      const role = await AppDataSource.getRepository(Role).findOne({ where: { name: "user" } })
      if (role) {
        await AuthService.setRole(newUser.id, role.id)
        newUserData = {
          ...newUser,
          role: role.name,
        }
      }

      res.status(201).json({ message: "User created successfully", user: newUserData })
    } catch (error: any) {
      console.error(error.message)
      res.status(500).json({ message: "Server Error" })
    }
  }

  static async getUsers(req: AuthenticatedRequest, res: Response) {
    try {
      const repo = await UserService.getUsers(req.body)
      ResponseUtil.sendResponse(res, "Fetched blog successfully", repo)
    } catch (error: any) {
      console.error(error.message)
      res.status(500).json({ message: "Server Error" })
    }
  }

  // Phương thức lấy thông tin người dùng
  // static async getUsers(req: AuthenticatedRequest, res: Response) {
  //   try {
  //     const { id } = req.params
  //     const userRepository = AppDataSource.getRepository(User)
  //     const user = await userRepository
  //       .createQueryBuilder("user")
  //       .leftJoinAndSelect("user.roles", "roles")
  //       .where("user.id = :id", { id })
  //       .getOne()


  //       if (!user) {
  //         return res.status(404).json({ message: "User not found" })
  //       }
  //       const newUser = {
  //         id: user.id,
  //         username: user.username,
  //         email: user.email,
  //         imgUrl: user.imgUrl,
  //         role: user.roles.map((role: any) => role.name),
  //         createdAt: user.createdAt,
  //         updatedAt: user.updatedAt,
  //         deletedAt: user.deletedAt,
  //       };

  //     res.status(200).json({message: `get User by ${id} success`,user: newUser})
  //   } catch (error: any) {
  //     console.error(error.message)
  //     res.status(500).json({ message: "Server Error" })
  //   }
  // }
  // Phương thức cập nhật thông tin người dùng
  static async update(req: Request, res: Response) {
    const userRepository = AppDataSource.getRepository(User)
    const userData = req.body
    const oldPassword = userData.oldPassword
    if (!oldPassword) {
      return res.status(400).json({ message: "You must provide the old password" });
    }

    const dto = new CreateUserDto()
    Object.assign(dto, userData)

    await validateOrReject(dto)

    const { id } = req.params
    const user = await userRepository.findOne({ where: { id: Number(id) } })
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }
    const checkUsername = await userRepository.findOne({ where: { username: userData.username } })

    if (checkUsername && checkUsername.id !== user.id) {
      return res.status(409).json({ message: "username đã tồn tại" })
    }

    if (userData.password) {
      const isPasswordValid = await bcrypt.compare(oldPassword, user.password)
      if (!isPasswordValid) {
        return res.status(400).json({ message: "Old password is incorrect" })
      }
      const hashedPassword = await bcrypt.hash(userData.password, 10)
      userData.password = hashedPassword
    }

    userRepository.merge(user, userData)
    await userRepository.save(user)

    res.status(200).json({ message: "User updated successfully", data: user })
  }

  static async createRole(req: Request, res: Response) {
    try {
      const usersId = req.body.usersId
      const rolesId = req.body.rolesId


      const roles = AppDataSource.getRepository('user_role')

      await roles.insert({ usersId, rolesId });
      
      const userRepository = AppDataSource.getRepository(User)
      const user = await userRepository
        .createQueryBuilder("user")
        .leftJoinAndSelect("user.roles", "roles")
        .where("user.id", { usersId })
        .getOne()

        if (!user) {
          return res.status(404).json({ message: "User not found" })
        }
        const newUser = {
          id: user.id,
          username: user.username,
          email: user.email,
          imgUrl: user.imgUrl,
          role: user.roles.map((role: any) => role.name),
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          deletedAt: user.deletedAt,
        };

      res.status(200).json({ message: "create Role success", user: newUser})
    } catch (error:any) {
      console.error(error.message)
      res.status(500).json({ message: "Server Error" })
    }
  }
  
  // Phương thức xóa người dùng
  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params // Lấy ID của người dùng từ thông tin được đính kèm trong request
      const userRepository = AppDataSource.getRepository(User)
      const user = await userRepository.findOne({ where: { id: Number(id) } })
      if (!user) {
        return res.status(404).json({ message: "User not found" })
      }
      await userRepository.remove(user)
      res.status(200).json({ message: "User deleted successfully", data: user })
    } catch (error: any) {
      console.error(error.message)
      res.status(500).json({ message: "Server Error" })
    }
  }
}

import { NextFunction, Request, Response } from "express"
import bcrypt from "bcryptjs"
import { AppDataSource } from "@/database/data-source"
import { User } from "@/database/entities/User"
import { validateOrReject } from "class-validator"
import { RegisterDTO } from "../dtos/UserDTO"
import { ResponseUtil } from "@/utils/Response"
import jwt from "jsonwebtoken"

import { EmailService } from "../services/EmailService"
import { BlacklistTokenService } from "../services/BlacklistTokenService"
import { AuthService } from "../services/AuthService"
import { Role } from "@/database/entities/Role"
import { Permission } from "@/database/entities/Permission"
import { emit } from "process"

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction): Promise<Response> {
    const registerData = req.body
    const userRepository = AppDataSource.getRepository(User)
    const dto = new RegisterDTO()
    // Mã hóa mật khẩu trước khi lưu vào cơ sở dữ liệu
    const salt = await bcrypt.genSalt(10)
    const encode_password = await bcrypt.hash(registerData.password, salt)
    dto.email = registerData.email
    dto.username = registerData.username
    dto.password = encode_password

    await validateOrReject(dto)
    // Kiểm tra xem người dùng đã tồn tại chưa
    const existingUser = await userRepository.findOne({
      where: [{ email: registerData.email }, { username: registerData.username }],
    })
    if (existingUser) {
      return res.status(409).json({ message: "Tải khoản đã tồn tại trong hệ thống" })
    }
    const repo = AppDataSource.getRepository(User)
    const user = repo.create(dto)
    await repo.save(user)
    const role = await AppDataSource.getRepository(Role).findOne({ where: { name: "user" } })
    if (role) await AuthService.setRole(user.id, role.id)
    // Tạo JWT token
    const payload = {
      user: {
        id: user.id,
        username: user.username,
      },
    }
    const accessToken = jwt.sign(payload, process.env.ACCESS_KEY_SECRET || "secret123", { expiresIn: 3600 })
    const refreshToken = jwt.sign({ userId: user.id }, process.env.REFRESH_KEY_SECRET || "refreshSecret", {
      expiresIn: "1d",
    })
    await userRepository.update({ id: user.id }, { refreshToken: refreshToken })

    //luu refresh-token vao redis
    // await redisClient.connectRedis();
    // await redisClient.set(String(user.id), refreshToken);
    // Trả về thông tin người dùng cùng với token và refreshToken
    let permission = await AppDataSource.getRepository(Permission).query(
      `SELECT DISTINCT permissions.name FROM users INNER JOIN user_role ON users.id = user_role.usersId INNER JOIN roles ON user_role.rolesId = roles.id INNER JOIN role_permission ON roles.id = role_permission.rolesId INNER JOIN permissions on role_permission.permissionsId = permissions.id WHERE users.id = ${user.id}`
    )
    permission = permission.map((per: any) => per.name)
    let roles = await AppDataSource.getRepository(Role).query(
      `SELECT DISTINCT roles.name FROM roles INNER JOIN user_role ON roles.id = user_role.rolesId INNER JOIN users ON user_role.usersId = users.id WHERE users.id = ${user.id}`
    )
    roles = roles.map((role: any) => role.name)
    const resUser = {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        roles: roles,
        permissions: permission,
        accessToken,
        refreshToken,
      },
    }
    return ResponseUtil.sendResponse(res, "Đăng ký thành công", resUser, null)
  }
  static async logout(req, res: Response, next: NextFunction): Promise<Response> {
    // Lấy access token từ request headers
    // const accessToken = req.headers.authorization?.split(" ")[1]
    // //xoa refreshToken
    // //@ts-ignore
    // const userId = req.user.id
    // const userRepository = AppDataSource.getRepository(User)
    // await userRepository.update({ id: userId }, { refreshToken: "" })

    // // xoa refresh-token khoi redis
    // await redisClient.connectRedis();
    // await redisClient.del(String(userId))
    // Xóa access token khỏi danh sách blacklisted tokens (nếu cần)
    // await BlacklistTokenService.addTokenToBlacklist(accessToken)

    return ResponseUtil.sendResponse(res, "Logout thành công", null, null)
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      // Lấy thông tin từ body request
      const { username, password } = req.body
      const userRepository = AppDataSource.getRepository(User)
      let user

      if (username.includes("@")) {
        user = await userRepository.findOne({ where: { email: username } })
      } else {
        user = await userRepository.findOne({ where: { username: username } })
      }
      if (!user) {
        return res.status(404).json({ msg: "Tài khoản chưa đăng ký" })
      }
      // Xác thực mật khẩu
      const isMatch = await bcrypt.compare(password, user.password)
      console.log("dfdf", user.password)

      if (!isMatch) {
        return res.status(401).json({ msg: "Sai mật khẩu" })
      }
      // // Gửi email xác thực
      // const verificationCode = EmailService.generateVerificationCode();
      // await EmailService.saveVerificationCodeToDB(user.id, verificationCode);
      // await EmailService.sendVerificationEmail(user.email, verificationCode);

      // Tạo JWT token và refreshToken
      const payload = {
        user: {
          id: user.id,
          username: user.username,
        },
      }
      const accessToken = jwt.sign(payload, process.env.ACCESS_KEY_SECRET || "secret123", { expiresIn: "15d" })
      const refreshToken = jwt.sign({ userId: user.id }, process.env.REFRESH_KEY_SECRET || "refreshSecret", {
        expiresIn: "30d",
      })
      await userRepository.update({ id: user.id }, { refreshToken })

      // Trả về thông tin người dùng cùng với token và refreshToken
      let permission = await AppDataSource.getRepository(Permission).query(
        `SELECT DISTINCT permissions.name FROM users INNER JOIN user_role ON users.id = user_role.usersId INNER JOIN roles ON user_role.rolesId = roles.id INNER JOIN role_permission ON roles.id = role_permission.rolesId INNER JOIN permissions on role_permission.permissionsId = permissions.id WHERE users.id = ${user.id}`
      )
      permission = permission.map((per: any) => per.name)
      let roles = await AppDataSource.getRepository(Role).query(
        `SELECT DISTINCT roles.name FROM roles INNER JOIN user_role ON roles.id = user_role.rolesId INNER JOIN users ON user_role.usersId = users.id WHERE users.id = ${user.id}`
      )
      roles = roles.map((role: any) => role.name)
      const resLogin = {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          image: user.imgUrl,
          roles: roles,
          permissions: permission,
          accessToken,
          refreshToken,
        },
      }
      return ResponseUtil.sendResponse(
        res,
        "Đăng nhập thành công. Vui lòng kiểm tra email để xác thực tài khoản",
        resLogin
      )
    } catch (err: any) {
      console.error(err.message)
      res.status(500).send("Server Error")
    }
  }
  static async refreshToken(req: Request, res: Response, next: NextFunction) {
    const refreshToken = req.body.refreshToken
    if (!refreshToken) return res.sendStatus(401)

    try {
      const userRepository = AppDataSource.getRepository(User)
      jwt.verify(refreshToken, process.env.REFRESH_KEY_SECRET || "refreshSecret", async (err, decoded) => {
        if (err) return res.sendStatus(403)

        const userId = decoded.userId
        const user = await userRepository.findOne({ where: { id: userId } })

        if (!user) return res.sendStatus(403)

        const payload = {
          user: {
            id: user.id,
            username: user.username,
          },
        }
        const accessToken = jwt.sign(payload, process.env.ACCESS_KEY_SECRET || "secret123", { expiresIn: "15d" })
        res.json({ accessToken })
      })
    } catch (err: any) {
      console.error(err.message)
      res.status(500).send("Server Error")
    }
  }

  static async addRole(req: Request, res: Response) {
    const role = req.body
    try {
      const repo = AppDataSource.getRepository(Role)
      const existingRole = await repo.findOne({ where: { name: role.name } })

      if (existingRole) {
        return res.status(400).json({ message: "Role name already exists" })
      }
      const newRole = repo.create(role)
      const data = await repo.save(newRole)
      return res.status(200).json({ message: "Add new role successful", data: data })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: error })
    }
  }

  static async getRole(req: Request, res: Response) {
    try {
      const repo = AppDataSource.getRepository(Role)
      const roles = await repo.find()
      console.log(roles)
      return res.status(200).json({ message: "get all role success", roles })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: error })
    }
  }

  static async updateRole(req: Request, res: Response) {
    try {
      const { id } = req.params
      const roleData = req.body

      const repo = AppDataSource.getRepository(Role)
      const roleToUpdate = await repo.findOneByOrFail({
        id: Number(id),
      })

      if (roleData.name && roleData.name !== roleToUpdate.name) {
        const existingRole = await repo.findOne({ where: { name: roleData.name } })

        if (existingRole) {
          return res.status(400).json({ message: "Role name already exists" })
        }
      }

      if (roleData.name) {
        roleToUpdate.name = roleData.name
      }
      await repo.save(roleToUpdate)

      return res.status(200).json({ message: "update role success", role: roleToUpdate })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: "server error" })
    }
  }

  static async deleteRole(req: Request, res: Response) {
    try {
      const { id } = req.params
      const repo = AppDataSource.getRepository(Role)
      const roleToUpdate = await repo.findOneByOrFail({
        id: Number(id),
      })
      await repo.remove(roleToUpdate)
      return res.status(200).json({ message: "delete role success" })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: "server error" })
    }
  }

  static async setRole(req: Request, res: Response) {
    const { userId, roleId } = req.body
    try {
      const data = await AuthService.setRole(userId, roleId)
      return res.status(200).json({ message: "Set role successful", data: data })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: error })
    }
  }
  static async setRolePermission(req: Request, res: Response) {
    const { permissions, roleId } = req.body
    try {
      for (let item of permissions) {
        const repo = AppDataSource.getRepository(Permission)
        const check = await repo.findOneByOrFail({ name: item })
        if (!check) return res.status(404).json({ message: `${item} is not a permission` })
        await repo.query(`insert into role_permission (rolesId, permissionsId) values (${roleId},${check.id})`)
      }
      return res.status(200).json({ message: "Set permission successful", data: { ...permissions, roleId } })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: error })
    }
  }
  static async getAllPermission(req: Request, res: Response) {
    try {
      const data = await AuthService.getAllPermissions()
      return res.status(200).json({ message: "Fetch permissions successful", permissions: data })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: error })
    }
  }

  // static async refreshTokenV3(req: Request, res: Response, next: NextFunction) {
  //   try {
  //     const time = new Date().getTime()
  //     console.log(`...time:::: ${time}____`)
  //     const refreshToken = req.body.refreshToken
  //     if (!refreshToken) return ResponseUtil.sendError(res, "Missing refreshToken", 403, null)
  //     const userRepository = AppDataSource.getRepository(User)
  //     jwt.verify(refreshToken, process.env.REFRESH_KEY_SECRET || "refreshSecret", async (err, decoded) => {
  //       if (err) return ResponseUtil.sendError(res, "Fail in verify refresh token", 403, err.message)

  //       const userId = String(decoded.userId)

  //       // Tạo lock cho userId trong Redis
  //       const lockKey = `lock_${userId}`
  //       // await redisClient.connectRedis();
  //       // const isLocked = await redisClient.setNXEX(lockKey, "locked", 60);

  //       // if (!isLocked) {
  //       //   return ResponseUtil.sendError(res, "Another process is handling the refresh token request. Please try again later.", 403, null);
  //       // }

  //       try {
  //         // Kiểm tra xem refresh token còn tồn tại trong Redis không
  //         // let rfTokenRedis = await redisClient.exists(userId);
  //         // if (!rfTokenRedis) {
  //         //   return ResponseUtil.sendError(res, "Refresh token was removed!", 403, null);
  //         // }

  //         // let compareRfToken = await redisClient.get(userId);
  //         if (true) {
  //           const user = await userRepository.findOne({ where: { id: Number(userId) } })
  //           if (!user) return ResponseUtil.sendError(res, "User of token not found!", 404, null)
  //           const payload = {
  //             user: {
  //               id: user.id,
  //               username: user.username,
  //             },
  //           }
  //           const accessToken = jwt.sign(payload, process.env.ACCESS_KEY_SECRET || "secret123", { expiresIn: "15m" })
  //           const newRefreshToken = jwt.sign({ userId: userId }, process.env.REFRESH_KEY_SECRET || "refreshSecret", {
  //             expiresIn: "1d",
  //           })
  //           // await redisClient.set(userId, newRefreshToken);
  //           // await redisClient.set(String(`${userId}_token`), accessToken);
  //           ResponseUtil.sendResponse(res, "get token success", { newRefreshToken, accessToken })
  //         } else {
  //           return ResponseUtil.sendError(res, "RefreshToken invalid", 403, null)
  //         }
  //       } finally {
  //         // Giải phóng lock
  //         // await redisClient.del(lockKey);
  //       }
  //     })
  //   } catch (err: any) {
  //     console.error(err.message)
  //     res.status(500).send("Server Error")
  //   }
  // }

  // static async redisv1(req: Request, res: Response) {
  //   const time = new Date().getTime();
  //   console.log(`...time:::: ${time}____`);
  //   const slTonKho=10;
  //   const keyValue = 'iphone13';
  //   const slMua = 1;
  //   await redisClient.connectRedis();
  //   const existKey = redisClient.exists(keyValue);
  //   if(!existKey) {
  //     await redisClient.set(keyValue, 0);
  //   }
  //   let slBanRa = await redisClient.get(keyValue);
  //   console.log(`Truoc khi user order thanh cong:::${time}`, slBanRa);

  //   slBanRa = await redisClient.incrby(keyValue, slMua);
  //   if(slBanRa>slTonKho) {
  //     console.log(`...time:::: ${time}____HET HANG`)
  //     // return res.json({
  //     // status: "error",
  //     // msg: "Het hang",
  //     // time
  //   // })
  //   }
  //   // slBanRa = await redisClient.incrby(keyValue, slMua);
  //   console.log(`Sau khi user order thanh cong:::${time}`, slBanRa);
  //   if(slBanRa>slTonKho) {
  //     await redisClient.set('banquaroi', slTonKho-slBanRa);
  //   }
  //   return res.json({
  //     status: "success",
  //     msg: "Oke",
  //     time
  //   })
  // }
}

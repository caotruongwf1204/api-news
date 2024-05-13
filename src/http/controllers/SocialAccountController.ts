// SocialAccountController.ts

import { Request, Response } from "express"
import { AppDataSource } from "@/database/data-source"
import { SocialAccount } from "@/database/entities/SocialAccount"
import { ValidationError, validateOrReject } from "class-validator"
import { CreateSocialAccountDto as CreateSocialAccountDto } from "../dtos/SocialAccountDTO"
import { ResponseUtil } from "@/utils/Response"

export class SocialAccountController {
  static async create(req: Request, res: Response) {
    const AccountData = req.body
    const dto = new CreateSocialAccountDto()
    Object.assign(dto, AccountData)

    await validateOrReject(dto)

    const repo = AppDataSource.getRepository(SocialAccount)
    const account = repo.create(AccountData)
    await repo.save(account)

    return ResponseUtil.sendResponse(res, "Successfully created new account", account)
  }

  static async getAccount(req: Request, res: Response) {
    const getAccount = await AppDataSource.getRepository(SocialAccount).createQueryBuilder().getMany()
    const accountData = getAccount.map((account: SocialAccount) => account)
    return ResponseUtil.sendResponse(res, "Fetched account successfully", accountData)
  }

  static async getAccountById(req: Request, res: Response) {
    const { id } = req.params
    const account = await AppDataSource.getRepository(SocialAccount).findOneByOrFail({
      id: Number(id),
    })
    return ResponseUtil.sendResponse<SocialAccount>(res, "Fetch Page successfully", account)
  }

  static async update(req: Request, res: Response) {
    try {
      const socialAccountId = parseInt(req.params.id)
      const socialAccountRepository = AppDataSource.getRepository(SocialAccount)
      const socialAccount = await socialAccountRepository.findOne({ where: { id: socialAccountId } })

      if (!socialAccount) {
        return res.status(404).json({ message: "Comment not found" })
      }

      const socialAccountData: any = req.body

      socialAccountRepository.merge(socialAccount, socialAccountData)
      await socialAccountRepository.save(socialAccount)

      res.json({ message: "Comment updated successfully" })
    } catch (error: any) {
      console.error(error.message)
      res.status(500).json({ message: "Server Error" })
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const socialAccountId = parseInt(req.params.id)
      const socialAccountRepository = AppDataSource.getRepository(SocialAccount)
      const socialAccount = await socialAccountRepository.findOne({ where: { id: socialAccountId } })

      if (!socialAccount) {
        return res.status(404).json({ message: "Comment not found" })
      }

      await socialAccountRepository.remove(socialAccount)

      res.json({ message: "Comment deleted successfully" })
    } catch (error: any) {
      console.error(error.message)
      res.status(500).json({ message: "Server Error" })
    }
  }
}

export default SocialAccountController

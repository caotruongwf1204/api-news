import { IsString, IsEmail, Length, IsOptional, IsNotEmpty } from "class-validator"

export class CreateSocialAccountDto {
  id?: number

  @IsNotEmpty()
  @IsString()
  platform: string

  @IsNotEmpty()
  @IsString()
  providerId: string
}

export class UpdateUserDto {
  id?: number

  @IsNotEmpty()
  @IsString()
  platform: string

  @IsNotEmpty()
  @IsString()
  providerId: string
}

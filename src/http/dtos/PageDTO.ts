import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator"

export class CreatePageDTO {
  id?: number

  @IsNotEmpty()
  @IsString()
  name: string
}

export class UpdatePageDTO {
  id?: number

  
  @IsNotEmpty()
  @IsString()
  name: string
}

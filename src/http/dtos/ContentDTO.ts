import { IsString, Length } from "class-validator"

export class CreateContentDto {
  @IsString()
  data: string
}

export class UpdateContentDto {
  @IsString()
  data: string
}

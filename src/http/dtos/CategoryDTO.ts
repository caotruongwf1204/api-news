import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator"

export class CreateCategoryDTO {
  id?: number

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  name: string
}

export class UpdateCategoryDTO {
  id?: number

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  name: string
}

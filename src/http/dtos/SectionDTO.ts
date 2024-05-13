import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator"

export class CreateSectionDTO {
  id?: number

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  name: string
}

export class UpdateSectionDTO {
  id?: number

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  name: string
}

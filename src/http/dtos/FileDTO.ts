import { IsNotEmpty, IsString, MinLength, MaxLength } from "class-validator"

export class CreateFileDTO {
  id?: number

  @IsNotEmpty()
  @IsString()
  filename: string

  @IsNotEmpty()
  @IsString()
  filepath: string

  @IsNotEmpty()
  @IsString()
  filetype: string
}

export class UpdateFileDTO {
  id?: number

  @IsNotEmpty()
  @IsString()
  filename: string
}

export class CreateFolderDTO {
  id?: number

  @IsNotEmpty()
  @IsString()
  name: string
}

import { IsString, Length, IsOptional, IsNumber, IsNotEmpty } from "class-validator"

export class CreateCommentDto {
  id?: number

  @IsString()
  @IsNotEmpty()
  content: string
  
  @IsNumber()
  blogPostId: number
}

export class UpdateCommentDto {
  id?: number

  @IsOptional()
  @IsString()
  content: string
}

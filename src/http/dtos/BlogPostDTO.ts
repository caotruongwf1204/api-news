import { IsEmail, IsNotEmpty, IsString, IsUrl, MaxLength, MinLength } from "class-validator"
import { Unique } from "typeorm";
export class CreateBlogPost {
    id?: number;

    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    content: string;

    viewCount: string

    @IsNotEmpty()
    categoryId: number;
    @IsNotEmpty()
    userId: number;

    @IsNotEmpty()
    commentsId: [];

    imgUrl?:string

    tagId: number;
}

export class UpdateBlogPost {
    id?: number;

    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(20)
    title: string;

    @IsNotEmpty()
    @IsString()
    content: string;

    imgUrl:string
}

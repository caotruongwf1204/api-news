import { IsString, IsEmail, Length, IsOptional,IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { User } from "../../database/entities/User";
import { IsUnique } from "../validators/IsUniqueValidator";
export class RegisterDTO {
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(20)
  // @IsUnique(User, "username")
  username: string;

  @IsNotEmpty()
  @IsEmail()
  @IsUnique(User, "email")
  email: string;

  @IsNotEmpty()
  password: string;

  imgUrl?:string
}

export class LoginDTO {

  
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(20)
  password: string;
}
export class CreateUserDto {
  @IsString()
  @Length(3, 30)
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @Length(6, 30)
  password: string;

  imgUrl?:string

}
export class UpdateUserDto {

  @IsOptional() // Thuộc tính có thể không được cung cấp trong request body
  @IsString()
  @Length(3, 30)
  name?: string;

  @IsOptional() // Thuộc tính có thể không được cung cấp trong request body
  @IsEmail()
  email?: string;

  imgUrl?:string
}
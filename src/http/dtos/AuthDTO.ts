import { IsEmail, IsNotEmpty, MaxLength, MinLength } from "class-validator";
import { User } from "../../database/entities/User";
import { IsUnique } from "../validators/IsUniqueValidator";

export class RegisterDTO {
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(20)
  username: string;

  @IsNotEmpty()
  @IsEmail()
  @IsUnique(User, "email")
  email: string;

  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(20)
  password: string;

  imgUrl?: string
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

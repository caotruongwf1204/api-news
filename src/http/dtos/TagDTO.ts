import { IsString, Length } from 'class-validator';

export class CreateTagDto {
  @IsString()
  @Length(1, 50)
  name: string;

  // Các thuộc tính khác của tag có thể được thêm ở đây nếu cần
}

export class UpdateTagDto {
  @IsString()
  @Length(1, 50)
  name?: string;

  // Các thuộc tính khác của tag có thể được thêm ở đây nếu cần
}

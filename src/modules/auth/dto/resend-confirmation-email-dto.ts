import { IsEmail, MinLength } from 'class-validator';

export class EmailDto {
  @IsEmail()
  @MinLength(6)
  email: string;
}

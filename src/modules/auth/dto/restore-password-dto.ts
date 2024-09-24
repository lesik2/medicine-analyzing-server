import { IsStrongPassword, MaxLength, MinLength } from 'class-validator';

export class RestorePasswordDto {
  token: string;

  userId: string;

  @MinLength(6)
  @MaxLength(64)
  @IsStrongPassword({
    minLowercase: 1,
    minUppercase: 1,
    minSymbols: 1,
    minNumbers: 0,
  })
  newPassword: string;
}

import {
  IsEmail,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';
import { IsUserAlreadyExist } from '../decorators/is-user-already-exist-decorator';
import { IsAlphaExtended } from '../decorators/is-alpha-extended-decorator';

export class CreateUserDto {
  @IsAlphaExtended()
  name: string;

  @IsAlphaExtended()
  surname: string;

  @IsEmail()
  @MinLength(6)
  @IsUserAlreadyExist()
  email: string;

  @MinLength(6)
  @MaxLength(64)
  @IsStrongPassword({
    minLowercase: 1,
    minUppercase: 1,
    minSymbols: 1,
    minNumbers: 0,
  })
  password: string;
}

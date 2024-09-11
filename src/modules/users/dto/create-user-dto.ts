import {
  IsEmail,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';
import { IsUserAlreadyExist } from '../decorators/is-user-already-exist-decorator';
import { IsAlphaExtended } from '../decorators/is-alpha-extended-decorator';

export class CreateUserDto {
  @IsString()
  @IsAlphaExtended()
  firstName: string;

  @IsString()
  @IsAlphaExtended()
  lastName: string;

  @IsEmail()
  @IsUserAlreadyExist()
  email: string;

  @MinLength(8)
  @MaxLength(50)
  @IsStrongPassword({
    minLowercase: 1,
    minUppercase: 1,
    minSymbols: 1,
    minNumbers: 0,
  })
  password: string;
}

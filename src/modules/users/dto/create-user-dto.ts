import {
  IsEmail,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';
import { IsUserAlreadyExist } from '../decorators/is-user-already-exist-decorator';
import { IsAlphaExtended } from '@/decorators/is-alpha-extended-decorator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description:
      'The first name of the user. Only alphabetic characters are allowed.',
    example: 'Алексей',
  })
  @IsAlphaExtended()
  name: string;

  @ApiProperty({
    description:
      'The surname of the user. Only alphabetic characters are allowed.',
    example: 'Пухальский',
  })
  @IsAlphaExtended()
  surname: string;

  @ApiProperty({
    description:
      'The email address of the user. Must be unique and in a valid format. Minimum length is 6 characters.',
    example: 'lesikpuhalskij@gmail.com',
  })
  @IsEmail()
  @MinLength(6)
  @IsUserAlreadyExist()
  email: string;

  @ApiProperty({
    description:
      'The password for the user account. It must be between 6 and 64 characters long and include at least one lowercase letter, one uppercase letter, and one symbol.',
    example: 'Alex1234!',
  })
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

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MinLength } from 'class-validator';

export class EmailDto {
  @ApiProperty({
    description:
      'The email address of the user. Must be a valid email format and at least 6 characters long.',
    example: 'user@example.com',
  })
  @IsEmail()
  @MinLength(6)
  email: string;
}

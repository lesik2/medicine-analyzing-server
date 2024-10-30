import { IsStrongPassword, MaxLength, MinLength } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class RestorePasswordDto {
  @ApiProperty({
    description:
      'The token for password restoration, usually sent to the user’s email.',
    example: 'abc123token456',
  })
  token: string;

  @ApiProperty({
    description:
      'The unique identifier of the user requesting the password reset.',
    example: 'user-id-12345',
  })
  userId: string;

  @ApiProperty({
    description:
      'The new password for the user. Must be between 6 and 64 characters long and include at least one lowercase letter, one uppercase letter, and one symbol.',
    example: 'NewPassword123!',
  })
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

import { Roles } from '@/types';
import { ApiProperty } from '@nestjs/swagger';

export class ExcludeUserResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the user.',
    example: 'e5b33c5e-1b9f-4f73-9b5e-9b83e55a9c56',
  })
  id: string;

  @ApiProperty({
    description: 'The name of the user.',
    example: 'Алексей',
  })
  name: string;

  @ApiProperty({
    description: 'The surname of the user.',
    example: 'Пухальский',
  })
  surname: string;

  @ApiProperty({
    description: 'The email address of the user.',
    example: 'lesikpuhalskij@gmail.com',
  })
  email: string;

  @ApiProperty({
    description: 'Indicates if the user has confirmed their email.',
    example: false,
  })
  isEmailConfirmed: boolean;

  @ApiProperty({
    description: 'The role assigned to the user.',
    example: 'USER',
  })
  role: Roles;
}

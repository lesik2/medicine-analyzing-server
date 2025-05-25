import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class ChangeActiveDto {
  @ApiProperty({
    description: 'The unique identifier of the entity. Must be a valid UUID.',
    example: 'e5b33c5e-1b9f-4f73-9b5e-9b83e55a9c56',
  })
  @IsUUID('all')
  id: string;
}

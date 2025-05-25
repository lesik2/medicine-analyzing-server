import { Specialty } from '@/types';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsUUID } from 'class-validator';

export class UpdateOfficeDto {
  @ApiProperty({
    description: 'The unique identifier of the office. Must be a valid UUID.',
    example: 'e5b33c5e-1b9f-4f73-9b5e-9b83e55a9c56',
  })
  @IsUUID('all')
  id: string;

  @ApiProperty({
    description: 'The office number. Must be a positive integer.',
    example: 101,
  })
  number: number;

  @ApiProperty({
    description:
      'The specialty associated with the office. Must be one of the predefined values in the Specialty enum.',
    enum: Specialty,
    example: Specialty.DENTISTRY,
  })
  @IsEnum(Specialty)
  specialty: Specialty;
}

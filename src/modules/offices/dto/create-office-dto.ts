import { Specialty } from '@/types';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export class CreateOfficeDto {
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

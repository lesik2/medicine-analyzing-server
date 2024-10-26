import { ApiProperty } from '@nestjs/swagger';
import { Specialty } from '@/types'; // Adjust the import path as necessary

export class DoctorResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the doctor.',
    example: 'e5b33c5e-1b9f-4f73-9b5e-9b83e55a9c56',
  })
  id: string;

  @ApiProperty({
    description: 'The full name of the doctor.',
    example: 'Иванов Иван Иванович',
  })
  fullName: string;

  @ApiProperty({
    description: 'The office number where the doctor works.',
    example: 101,
  })
  officeNumber: number;

  @ApiProperty({
    description: 'The specialty of the doctor.',
    enum: Specialty,
  })
  specialty: Specialty;
}

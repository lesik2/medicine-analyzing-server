import { Specialty, TypesOfShifts } from '@/types';
import { ApiProperty } from '@nestjs/swagger';

export class DoctorResponseEntityDto {
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
    description: 'The specialty of the doctor.',
    enum: Specialty,
  })
  specialty: Specialty;

  @ApiProperty({
    description: 'The type of shifts the doctor works.',
    enum: TypesOfShifts,
  })
  typeOfShifts: TypesOfShifts;

  @ApiProperty({
    description:
      'The office number where the doctor works. Can be null if not assigned to an office.',
    example: 101,
    nullable: true,
  })
  officeNumber: number | null;
}

export class GetAllDoctorsResponseDto {
  @ApiProperty({
    description: 'The total number of doctors available.',
    example: 100,
  })
  total: number;

  @ApiProperty({
    description: 'List of doctor entities.',
    type: [DoctorResponseEntityDto],
  })
  items: DoctorResponseEntityDto[];
}

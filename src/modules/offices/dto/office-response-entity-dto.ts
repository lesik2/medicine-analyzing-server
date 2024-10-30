import { Specialty, Status, TypesOfShifts } from '@/types';
import { ApiProperty } from '@nestjs/swagger';

export class DoctorDto {
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
    description: 'The type of shifts the doctor works.',
    enum: TypesOfShifts,
  })
  typeOfShifts: TypesOfShifts;
}

export class OfficeResponseEntityDto {
  @ApiProperty({
    description: 'The unique identifier of the office.',
    example: 'e5b33c5e-1b9f-4f73-9b5e-9b83e55a9c56',
  })
  id: string;

  @ApiProperty({
    description: 'The number of the office.',
    example: 101,
  })
  number: number;

  @ApiProperty({
    description: 'The specialty of the office.',
    enum: Specialty,
  })
  specialty: Specialty;

  @ApiProperty({
    description: 'List of doctors in the office.',
    type: [DoctorDto],
  })
  doctors: DoctorDto[];

  @ApiProperty({
    description: 'The status of the office.',
    enum: Status,
  })
  status: Status;
}

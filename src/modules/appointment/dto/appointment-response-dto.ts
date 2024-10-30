import { ApiProperty } from '@nestjs/swagger';
import { Specialty } from '@/types'; // Adjust the path as necessary

export class AppointmentResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the appointment.',
    example: 'e5b33c5e-1b9f-4f73-9b5e-9b83e55a9c56',
  })
  id: string;

  @ApiProperty({
    description: 'The date and time of the appointment in ISO format.',
    example: '2024-10-25 14:30',
  })
  dateAndTime: string;

  @ApiProperty({
    description: 'The full name of the patient.',
    example: 'Иванов Иван Иванович',
  })
  patientFullName: string;

  @ApiProperty({
    description: 'The specialty of the appointment.',
    enum: Specialty,
  })
  specialty: Specialty;

  @ApiProperty({
    description: 'The full name of the doctor.',
    example: 'Петров Петр Петрович',
  })
  doctorFullName: string;

  @ApiProperty({
    description:
      'The office number where the appointment takes place. Can be undefined.',
    example: 101,
    nullable: true,
  })
  officeNumber: number | undefined;
}

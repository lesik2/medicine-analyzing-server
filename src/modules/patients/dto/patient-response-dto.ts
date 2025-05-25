import { ApiProperty } from '@nestjs/swagger';

export class PatientResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the patient.',
    example: 'e5b33c5e-1b9f-4f73-9b5e-9b83e55a9c56',
  })
  id: string;

  @ApiProperty({
    description: 'Indicates whether the patient is active.',
    example: true,
  })
  active: boolean;

  @ApiProperty({
    description: 'The date of birth of the patient in ISO format.',
    example: '1985-06-15',
  })
  dateOfBirth: string;

  @ApiProperty({
    description: 'The full name of the patient.',
    example: 'Иванов Иван Иванович',
  })
  fullName: string;
}

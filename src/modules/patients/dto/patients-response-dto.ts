import { ApiProperty } from '@nestjs/swagger';
import { PatientDto } from './patient-response-dto';

export class PatientsResponseDto {
  @ApiProperty({
    description: 'List of patients.',
    type: [PatientDto],
  })
  patients: PatientDto[];
}

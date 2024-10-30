import { ApiProperty } from '@nestjs/swagger';
import { AppointmentResponseDto } from './appointment-response-dto';

export class AppointmentResponseByPatientDto {
  @ApiProperty({
    description: 'List of upcoming appointments.',
    type: [AppointmentResponseDto],
  })
  upcoming: AppointmentResponseDto[];

  @ApiProperty({
    description: 'List of historical appointments.',
    type: [AppointmentResponseDto],
  })
  history: AppointmentResponseDto[];
}

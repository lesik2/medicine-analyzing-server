import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GetTimeSlotsQueryDto {
  @ApiProperty({
    description: 'The unique identifier of the doctor.',
    example: 'e5b33c5e-1b9f-4f73-9b5e-9b83e55a9c56',
  })
  @IsString()
  doctorId: string;

  @ApiProperty({
    description:
      'The date for which to retrieve available time slots in ISO format.',
    example: '2024-10-25',
  })
  @IsString()
  date: string;
}

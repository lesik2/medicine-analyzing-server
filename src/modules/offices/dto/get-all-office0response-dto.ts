import { ApiProperty } from '@nestjs/swagger';
import { OfficeResponseEntityDto } from './office-response-entity-dto';

export class GetAllOfficeResponseDto {
  @ApiProperty({
    description: 'The total number of offices available.',
    example: 100,
  })
  total: number;

  @ApiProperty({
    description: 'List of office entities.',
    type: [OfficeResponseEntityDto],
  })
  items: OfficeResponseEntityDto[];
}

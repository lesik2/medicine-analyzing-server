import { Specialty, Status } from '@/types';
import { SortDirection } from '@/types/sortDirection';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class FiltersDto {
  @ApiPropertyOptional({
    description: 'Filter by the status of the office.',
    enum: Status,
    example: Status.FILLED,
  })
  @IsEnum(Status)
  @IsOptional()
  status: Status;

  @ApiPropertyOptional({
    description: 'Filter by the specialty of the office.',
    enum: Specialty,
    example: Specialty.DENTISTRY,
  })
  @IsEnum(Specialty)
  @IsOptional()
  specialty: Specialty;
}

export class GetAllOfficesQueryDto {
  @ApiPropertyOptional({
    description: 'The key to sort the offices by.',
    example: 'specialty',
  })
  @IsOptional()
  @IsString()
  sortKey?: string;

  @ApiPropertyOptional({
    description: 'The direction to sort the offices. Can be "ASC" or "DESC".',
    enum: SortDirection,
    example: SortDirection.ASC,
  })
  @IsOptional()
  @IsEnum(SortDirection)
  sortDirection?: SortDirection;

  @ApiProperty({
    description: 'The page number for pagination.',
    example: 1,
  })
  @IsNumber()
  page: number;

  @ApiProperty({
    description: 'The number of offices per page.',
    example: 10,
  })
  @IsNumber()
  perPage: number;

  @ApiPropertyOptional({
    description: 'Filters for querying offices.',
    type: Object,
    example: {
      status: Status.FILLED,
      specialty: Specialty.CARDIOLOGY,
    },
  })
  @ApiPropertyOptional({
    description:
      'Optional filters to narrow down the list of offices based on their status and specialty.',
    type: FiltersDto,
    example: {
      status: Status.FILLED,
      specialty: Specialty.DENTISTRY,
    },
  })
  @IsOptional()
  filters?: FiltersDto;
}

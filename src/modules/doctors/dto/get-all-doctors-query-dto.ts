import { Specialty, Status, TypesOfShifts } from '@/types';
import { SortDirection } from '@/types/sortDirection';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class FiltersDto {
  @IsEnum(TypesOfShifts)
  @IsOptional()
  status: TypesOfShifts;

  @IsEnum(Specialty)
  @IsOptional()
  specialty: Specialty;

  @IsNumber()
  @IsOptional()
  number: number;
}

export class GetAllDoctorsQueryDto {
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
  @IsOptional()
  filters?: FiltersDto;
}

import { Specialty } from '@/types';
import { IsEnum } from 'class-validator';

export class CreateOfficeDto {
  number: number;

  @IsEnum(Specialty)
  specialty: Specialty;
}

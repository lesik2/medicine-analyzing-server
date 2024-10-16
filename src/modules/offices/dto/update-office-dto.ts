import { Specialty } from '@/types';
import { IsEnum, IsUUID } from 'class-validator';

export class UpdateOfficeDto {
  @IsUUID('all')
  id: string;

  number: number;

  @IsEnum(Specialty)
  specialty: Specialty;
}

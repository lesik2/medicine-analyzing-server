import { IsAlphaExtended } from '@/decorators/is-alpha-extended-decorator';
import { Specialty, TypesOfShifts } from '@/types';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsUUID,
  MinLength,
} from 'class-validator';

export class UpdateDoctorDto {
  @IsUUID('all')
  id: string;

  @IsAlphaExtended()
  name: string;

  @IsAlphaExtended()
  surname: string;

  @IsOptional()
  @IsAlphaExtended()
  patronymic?: string;

  @IsEnum(Specialty)
  specialty: Specialty;

  @IsEnum(TypesOfShifts)
  typeOfShifts: TypesOfShifts;

  @IsOptional()
  @IsUUID('all')
  officeId?: string;

  @IsEmail()
  @MinLength(6)
  email: string;
}

import { IsAlphaExtended } from '@/decorators/is-alpha-extended-decorator';
import { Gender, TypeOfPatient } from '@/types';
import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUUID,
} from 'class-validator';

export class UpdatePatientDto {
  @IsUUID('all')
  id: string;

  @IsAlphaExtended()
  name: string;

  @IsAlphaExtended()
  surname: string;

  @IsOptional()
  @IsAlphaExtended()
  patronymic: string | null;

  @IsEnum(Gender)
  gender: Gender;

  @IsEnum(TypeOfPatient)
  ageCategory: TypeOfPatient;

  @IsDateString()
  dateOfBirth: string;

  @IsPhoneNumber('BY')
  phone: string;

  @IsString()
  address: string;
}

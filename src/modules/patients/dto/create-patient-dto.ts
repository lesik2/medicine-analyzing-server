import { IsAlphaExtended } from '@/decorators/is-alpha-extended-decorator';
import { Gender, TypeOfPatient } from '@/types';
import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class CreatePatientDto {
  @IsAlphaExtended()
  name: string;

  @IsAlphaExtended()
  surname: string;

  @IsOptional()
  @IsAlphaExtended()
  patronymic: string;

  @IsEnum(Gender)
  gender: Gender;

  @IsEnum(TypeOfPatient)
  ageCategory: TypeOfPatient;

  @IsDateString()
  dateOfBirth: string;

  @IsPhoneNumber('BY')
  phone: string;

  @IsAlphaExtended()
  locality: string;

  @IsString()
  address: string;
}

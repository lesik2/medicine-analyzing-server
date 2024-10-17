import { IsAlphaExtended } from '@/decorators/is-alpha-extended-decorator';
import { Gender, AgeCategory } from '@/types';
import { IsDateString, IsEnum, IsOptional } from 'class-validator';

export class CreatePatientDto {
  @IsAlphaExtended()
  name: string;

  @IsAlphaExtended()
  surname: string;

  @IsOptional()
  @IsAlphaExtended()
  patronymic: string | null;

  @IsEnum(Gender)
  gender: Gender;

  @IsEnum(AgeCategory)
  ageCategory: AgeCategory;

  @IsDateString()
  dateOfBirth: string;
}

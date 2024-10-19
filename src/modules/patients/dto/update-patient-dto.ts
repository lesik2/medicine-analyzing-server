import { IsAlphaExtended } from '@/decorators/is-alpha-extended-decorator';
import { AgeCategory, Gender } from '@/types';
import { IsDateString, IsEnum, IsOptional, IsUUID } from 'class-validator';

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

  @IsDateString()
  dateOfBirth: string;

  @IsEnum(AgeCategory)
  ageCategory: AgeCategory;
}

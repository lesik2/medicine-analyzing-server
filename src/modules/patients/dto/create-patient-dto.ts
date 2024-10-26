import { IsAlphaExtended } from '@/decorators/is-alpha-extended-decorator';
import { Gender, AgeCategory } from '@/types';
import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional } from 'class-validator';

export class CreatePatientDto {
  @ApiProperty({
    description:
      'The first name of the patient. Only alphabetic characters are allowed.',
    example: 'Алексей',
  })
  @IsAlphaExtended()
  name: string;

  @ApiProperty({
    description:
      'The surname of the patient. Only alphabetic characters are allowed.',
    example: 'Пухальский',
  })
  @IsAlphaExtended()
  surname: string;

  @ApiProperty({
    description:
      'The patronymic of the patient. This field is optional and can include alphabetic characters only.',
    example: 'Александрович',
    required: false,
  })
  @IsOptional()
  @IsAlphaExtended()
  patronymic: string | null;

  @ApiProperty({
    description:
      'The gender of the patient. Must be one of the predefined values in the Gender enum.',
    enum: Gender,
    example: Gender.MALE,
  })
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({
    description:
      'The age category of the patient. Must be one of the predefined values in the AgeCategory enum.',
    enum: AgeCategory,
    example: AgeCategory.ADULT,
  })
  @IsEnum(AgeCategory)
  ageCategory: AgeCategory;

  @ApiProperty({
    description: 'The date of birth of the patient in ISO 8601 format.',
    example: '1990-05-15',
  })
  @IsDateString()
  dateOfBirth: string;
}

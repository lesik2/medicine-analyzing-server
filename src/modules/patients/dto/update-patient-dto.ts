import { IsAlphaExtended } from '@/decorators/is-alpha-extended-decorator';
import { AgeCategory, Gender } from '@/types';
import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsUUID } from 'class-validator';

export class UpdatePatientDto {
  @ApiProperty({
    description: 'The unique identifier of the patient. Must be a valid UUID.',
    example: 'e5b33c5e-1b9f-4f73-9b5e-9b83e55a9c56',
  })
  @IsUUID('all')
  id: string;

  @ApiProperty({
    description:
      'The first name of the patient. Only alphabetic characters are allowed.',
    example: 'Иван',
  })
  @IsAlphaExtended()
  name: string;

  @ApiProperty({
    description:
      'The surname of the patient. Only alphabetic characters are allowed.',
    example: 'Иванов',
  })
  @IsAlphaExtended()
  surname: string;

  @ApiProperty({
    description:
      'The patronymic of the patient. This field is optional and can include alphabetic characters only.',
    example: 'Иванович',
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
    description: 'The date of birth of the patient in ISO 8601 format.',
    example: '1990-01-01',
  })
  @IsDateString()
  dateOfBirth: string;

  @ApiProperty({
    description:
      'The age category of the patient. Must be one of the predefined values in the AgeCategory enum.',
    enum: AgeCategory,
    example: AgeCategory.ADULT,
  })
  @IsEnum(AgeCategory)
  ageCategory: AgeCategory;
}

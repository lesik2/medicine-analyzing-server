import { IsAlphaExtended } from '@/decorators/is-alpha-extended-decorator';
import { Specialty, TypesOfShifts } from '@/types';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsUUID,
  MinLength,
} from 'class-validator';

export class UpdateDoctorDto {
  @ApiProperty({
    description: 'The unique identifier of the doctor. Must be a valid UUID.',
    example: 'e5b33c5e-1b9f-4f73-9b5e-9b83e55a9c56',
  })
  @IsUUID('all')
  id: string;

  @ApiProperty({
    description:
      'The first name of the doctor. Only alphabetic characters are allowed.',
    example: 'Алексей',
  })
  @IsAlphaExtended()
  name: string;

  @ApiProperty({
    description:
      'The surname of the doctor. Only alphabetic characters are allowed.',
    example: 'Иванов',
  })
  @IsAlphaExtended()
  surname: string;

  @ApiProperty({
    description:
      'The patronymic of the doctor. This field is optional and can include alphabetic characters only.',
    example: 'Александрович',
    required: false,
  })
  @IsOptional()
  @IsAlphaExtended()
  patronymic?: string;

  @ApiProperty({
    description:
      'The specialty of the doctor. Must be one of the predefined values in the Specialty enum.',
    enum: Specialty,
    example: Specialty.CARDIOLOGY,
  })
  @IsEnum(Specialty)
  specialty: Specialty;

  @ApiProperty({
    description:
      'The type of shifts for the doctor. Must be one of the predefined values in the TypesOfShifts enum.',
    enum: TypesOfShifts,
    example: TypesOfShifts.FIRST_SHIFT,
  })
  @IsEnum(TypesOfShifts)
  typeOfShifts: TypesOfShifts;

  @ApiProperty({
    description:
      'The office ID where the doctor works. This field is optional and must be a valid UUID.',
    example: 'e5b33c5e-1b9f-4f73-9b5e-9b83e55a9c56',
    required: false,
  })
  @IsOptional()
  @IsUUID('all')
  officeId?: string;

  @ApiProperty({
    description:
      'The email address of the doctor. Must be a valid email format and at least 6 characters long.',
    example: 'doctor@example.com',
  })
  @IsEmail()
  @MinLength(6)
  email: string;
}

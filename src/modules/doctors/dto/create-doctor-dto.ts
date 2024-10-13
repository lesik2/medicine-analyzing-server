import { IsAlphaExtended } from '@/decorators/is-alpha-extended-decorator';
import { IsUserAlreadyExist } from '@/modules/users/decorators/is-user-already-exist-decorator';
import { Specialty, TypesOfShifts } from '@/types';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsUUID,
  MinLength,
} from 'class-validator';

export class CreateDoctorDto {
  @IsAlphaExtended()
  name: string;

  @IsAlphaExtended()
  surname: string;

  @IsOptional()
  @IsAlphaExtended()
  patronymic: string | null;

  @IsEnum(Specialty)
  specialty: Specialty;

  @IsEnum(TypesOfShifts)
  typeOfShifts: TypesOfShifts;

  @IsUUID('all')
  officeId: string;

  @IsEmail()
  @MinLength(6)
  @IsUserAlreadyExist()
  email: string;
}

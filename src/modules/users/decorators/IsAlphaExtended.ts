import { ErrorMessages } from '@/common/errorMessages';
import { RegularExpressions } from '@/common/regularExpressions';
import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
@Injectable()
export class IsAlphaExtendedConstraint implements ValidatorConstraintInterface {
  validate(value: string) {
    return RegularExpressions.lettersEnglishAndCyrillic.test(value);
  }

  defaultMessage() {
    return ErrorMessages.ONLY_LETTERS;
  }
}

export function IsAlphaExtended(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsAlphaExtendedConstraint,
    });
  };
}

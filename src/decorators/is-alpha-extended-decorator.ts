import { ErrorMessages } from '@/common/error-messages';
import { RegularExpressions } from '@/common/regular-expressions';
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
    if (!value) return true;
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

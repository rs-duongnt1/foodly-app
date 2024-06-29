import configs from '@configs/index';
import { applyDecorators } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  IsOptional,
  IsString,
  ValidateBy,
  ValidationOptions,
  ValidationArguments,
  Matches,
  IsEmail,
  MaxLength,
  MinLength,
  IsNotEmpty,
  IsUrl,
  IsEnum,
  Max,
  Min,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import {
  IsEqualTo,
  ToArray,
  ToInt,
  ToLowerCase,
  ToUpperCase,
  Trim,
} from './transform.decorator';

interface IStringFieldOptions {
  length?: number;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  toInt?: boolean;
  toLowerCase?: boolean;
  toUpperCase?: boolean;
  allowEmpty?: boolean;
  email?: boolean;
  url?: boolean;
  regex?: { pattern: string | RegExp; message?: string };
  equalTo?: string;
  password?: boolean;
  passwordConfirm?: boolean;
  isStringNumber?: boolean;
}

const configService = new ConfigService(configs());

export function StringField(
  options: IStringFieldOptions = {},
  property?: Array<string>,
): PropertyDecorator {
  const decorators = [
    IsString({
      message: i18nValidationMessage('validation.IsString', {
        property: property?.[0],
      }),
    }),
    Trim(),
  ];

  if (!options.allowEmpty) {
    decorators.push(
      IsNotEmpty({
        message: i18nValidationMessage('validation.IsNotEmpty', {
          property: property?.[0],
        }),
      }),
    );
  }

  if (options?.length) {
    decorators.push(
      MinLength(options.length, {
        message: i18nValidationMessage('validation.MinLength', {
          count: options.length,
          property: property?.[0],
        }),
      }),
    );
    decorators.push(
      MaxLength(options.length, {
        message: i18nValidationMessage('validation.MaxLength', {
          count: options.length,
          property: property?.[0],
        }),
      }),
    );
  }

  if (options?.minLength) {
    decorators.push(
      MinLength(options.minLength, {
        message: i18nValidationMessage('validation.MinLength', {
          count: options.minLength,
          property: property?.[0],
        }),
      }),
    );
  }

  if (options?.maxLength) {
    decorators.push(
      MaxLength(options.maxLength, {
        message: i18nValidationMessage('validation.MaxLength', {
          count: options.maxLength,
          property: property?.[0],
        }),
      }),
    );
  }

  if (options.url) {
    decorators.push(
      IsUrl(undefined, {
        message: i18nValidationMessage('validation.IsUrl', {
          property: property?.[0],
        }),
      }),
    );
  }

  if (options.email) {
    decorators.push(
      IsEmail(undefined, {
        message: i18nValidationMessage('validation.IsEmail', {
          property: property?.[0],
        }),
      }),
    );
  }

  if (options?.regex) {
    decorators.push(
      Matches(
        typeof options?.regex.pattern === 'string'
          ? new RegExp(options?.regex.pattern)
          : options?.regex.pattern,
        {
          message:
            options.regex.message ||
            i18nValidationMessage('validation.invalid', {
              property: property?.[0],
              constraints: [property?.[1]],
            }),
        },
      ),
    );
  }

  if (options.equalTo) {
    decorators.push(
      IsEqualTo(options.equalTo, {
        message: i18nValidationMessage('validation.IsEqualTo', {
          property: property?.[0],
          constraints: [property?.[1]],
        }),
      }),
    );
  }

  if (options.password) {
    decorators.push(
      IsPassword({
        message: i18nValidationMessage('validation.IsPassword', {
          property: property?.[0],
        }),
      }),
    );
  }

  if (options?.toLowerCase) {
    decorators.push(ToLowerCase());
  }

  if (options.max) {
    decorators.push(
      ToInt(),
      Max(options.max, {
        message: i18nValidationMessage('validation.Max', {
          property: property?.[0],
          constraints: [property?.[1]],
        }),
      }),
    );
  }

  if (options.min) {
    decorators.push(
      ToInt(),
      Min(options.min, {
        message: i18nValidationMessage('validation.Max', {
          property: property?.[0],
          constraints: [property?.[1]],
        }),
      }),
    );
  }

  if (options?.toUpperCase) {
    decorators.push(ToUpperCase());
  }

  if (options?.toInt) {
    decorators.push(ToInt());
  }

  return applyDecorators(...decorators);
}

export function StringFieldOptional(
  options: IStringFieldOptions = {},
  property?: string,
): PropertyDecorator {
  return applyDecorators(
    IsOptional(),
    StringField({ allowEmpty: true, ...options }, [property]),
  );
}

export function IsPassword(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return ValidateBy(
    {
      name: 'IsPassword',
      constraints: [
        configService.get(
          'jwt.passwordPattern',
          '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$',
        ),
      ],
      validator: {
        validate(value: string, args: ValidationArguments) {
          const passwordPattern = args.constraints[0];
          if (!passwordPattern) return true;

          if (passwordPattern instanceof RegExp) {
            return passwordPattern.test(value);
          }
          const regex = new RegExp(passwordPattern);
          return regex.test(value);
        },

        defaultMessage(validationArguments?: ValidationArguments): string {
          const passwordPattern: string =
            validationArguments.constraints[0] || '';
          return `Password doesn't match with pattern ${passwordPattern}`;
        },
      },
    },
    validationOptions,
  );
}

export function EnumField<TEnum>(
  getEnum: () => TEnum,
  options: Partial<{ each: boolean }> = {},
): PropertyDecorator {
  const enumValue = getEnum() as unknown;
  const decorators = [
    IsEnum(enumValue as object, {
      each: options?.each,
      message: i18nValidationMessage('validation.IsEnum', {
        enum: Object.values(enumValue),
      }),
    }),
  ];

  if (options.each) {
    decorators.push(ToArray());
  }

  return applyDecorators(...decorators);
}

export function EnumFieldOptional<TEnum>(
  getEnum: () => TEnum,
  options: Partial<{ each: boolean }> = {},
): PropertyDecorator {
  return applyDecorators(IsOptional(), EnumField(getEnum, { ...options }));
}

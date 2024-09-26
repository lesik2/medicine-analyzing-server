import { Reflector } from '@nestjs/core';

export const AppRoles = Reflector.createDecorator<string[]>();

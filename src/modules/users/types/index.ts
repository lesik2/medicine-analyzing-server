import { Roles } from '@/types';

export interface CreateUser {
  name: string;

  surname: string;

  email: string;

  password: string;

  role?: Roles;
}

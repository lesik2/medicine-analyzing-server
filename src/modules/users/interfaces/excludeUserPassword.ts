import { User } from '../models/user.entity';

export type ExcludeUserPassword = Omit<typeof User, 'password' | 'prototype'>;

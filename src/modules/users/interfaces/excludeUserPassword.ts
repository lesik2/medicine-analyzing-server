import { User } from '../models/user.entity';

export type ExcludeUserPassword = Omit<InstanceType<typeof User>, 'password'>;

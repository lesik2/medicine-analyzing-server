import { User } from '@/modules/users/models/user.entity';

export type ExcludeUserPassword = Omit<InstanceType<typeof User>, 'password'>;

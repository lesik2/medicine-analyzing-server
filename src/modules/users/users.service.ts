import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './models/user.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { encryptPassword } from '@/utils/hashPassword';
import { ExcludeUserPassword } from './interfaces/excludeUserPassword';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<ExcludeUserPassword[]> {
    return (await this.usersRepository.find()).map((user) =>
      this.excludePasswordFromUser(user),
    );
  }

  async findOne(options: FindOptionsWhere<User>) {
    return await this.usersRepository.findOne({ where: options });
  }

  excludePasswordFromUser(user: User): ExcludeUserPassword {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async create(requestUser: CreateUserDto): Promise<ExcludeUserPassword> {
    const user = this.usersRepository.create({
      firstName: requestUser.firstName,
      lastName: requestUser.lastName,
      email: requestUser.email,
      password: await encryptPassword(requestUser.password),
    });

    const savedUser = await this.usersRepository.save(user);
    return this.excludePasswordFromUser(savedUser);
  }
}

import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './models/user.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ExcludeUserPassword } from '@/types/excludeUserPassword';

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

  async update(userId: string, updatedData: Partial<User>) {
    return await this.usersRepository.update(userId, updatedData);
  }

  excludePasswordFromUser(user: User): ExcludeUserPassword {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async create(requestUser: CreateUserDto): Promise<ExcludeUserPassword> {
    const user = this.usersRepository.create({
      email: requestUser.email,
      password: await this.encryptData(requestUser.password),
      name: requestUser.name,
      surname: requestUser.surname,
    });

    const savedUser = await this.usersRepository.save(user);
    return this.excludePasswordFromUser(savedUser);
  }

  async encryptData(data: string) {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(data, salt);
    return hash;
  }

  async decryptData(data: string, hash: string) {
    const isMatch = await bcrypt.compare(data, hash);
    return isMatch;
  }
}

import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './models/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IsUserAlreadyExistConstraint } from './decorators/isUserAlreadyExist';
import { IsAlphaExtendedConstraint } from './decorators/IsAlphaExtended';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    IsUserAlreadyExistConstraint,
    IsAlphaExtendedConstraint,
  ],
  imports: [TypeOrmModule.forFeature([User])],
})
export class UsersModule {}

import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './models/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IsUserAlreadyExistConstraint } from './decorators/is-user-already-exist-decorator';
import { IsAlphaExtendedConstraint } from './decorators/is-alpha-extended-decorator';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    IsUserAlreadyExistConstraint,
    IsAlphaExtendedConstraint,
  ],
  imports: [TypeOrmModule.forFeature([User])],
  exports: [UsersService],
})
export class UsersModule {}
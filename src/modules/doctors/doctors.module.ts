import { Module } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { DoctorsController } from './doctors.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doctor } from './models/doctor.entity';
import { AuthModule } from '../auth/auth.module';
import { OfficesModule } from '../offices/offices.module';
import { UsersModule } from '../users/users.module';

@Module({
  providers: [DoctorsService],
  controllers: [DoctorsController],
  exports: [DoctorsService],
  imports: [
    TypeOrmModule.forFeature([Doctor]),
    AuthModule,
    OfficesModule,
    UsersModule,
  ],
})
export class DoctorsModule {}

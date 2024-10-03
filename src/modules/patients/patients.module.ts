import { Module } from '@nestjs/common';
import { PatientsController } from './patients.controller';
import { PatientsService } from './patients.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from './models/patient.entity';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [PatientsController],
  providers: [PatientsService],
  exports: [PatientsService],
  imports: [TypeOrmModule.forFeature([Patient]), UsersModule],
})
export class PatientsModule {}

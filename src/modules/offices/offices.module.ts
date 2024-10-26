import { forwardRef, Module } from '@nestjs/common';
import { OfficesService } from './offices.service';
import { OfficesController } from './offices.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Office } from './models/office.entity';
import { DoctorsModule } from '../doctors/doctors.module';

@Module({
  providers: [OfficesService],
  controllers: [OfficesController],
  exports: [OfficesService],
  imports: [
    TypeOrmModule.forFeature([Office]),
    forwardRef(() => DoctorsModule),
  ],
})
export class OfficesModule {}

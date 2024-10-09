import { Module } from '@nestjs/common';
import { OfficesService } from './offices.service';
import { OfficesController } from './offices.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Office } from './models/office.entity';

@Module({
  providers: [OfficesService],
  controllers: [OfficesController],
  exports: [OfficesService],
  imports: [TypeOrmModule.forFeature([Office])],
})
export class OfficesModule {}

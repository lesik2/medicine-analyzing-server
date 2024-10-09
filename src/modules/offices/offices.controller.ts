import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { OfficesService } from './offices.service';
import { JwtAuthGuard } from '../auth/guards/jwt.auth.guard';
import { RolesGuard } from '@/guards/roles.guard';
import { AppRoles } from '@/decorators/roles-decorator';
import { Departments, Roles } from '@/types';
import { IdParams } from '@/types/params';

@UseGuards(JwtAuthGuard, RolesGuard)
@AppRoles([Roles.MANAGER])
@Controller('offices')
export class OfficesController {
  constructor(private readonly officeService: OfficesService) {}

  @Get()
  async findAll(@Query('department') department?: Departments[] | Departments) {
    return await this.officeService.findAll(department);
  }

  @Get(':id')
  async findOne(@Param() params: IdParams) {
    return await this.officeService.findOne(params.id);
  }
}

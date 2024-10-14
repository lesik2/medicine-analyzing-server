import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { OfficesService } from './offices.service';
import { JwtAuthGuard } from '../auth/guards/jwt.auth.guard';
import { RolesGuard } from '@/guards/roles.guard';
import { AppRoles } from '@/decorators/roles-decorator';
import { Roles } from '@/types';
import { IdParams } from '@/types/params';
import { getAllOfficesQuery, getFreeOfficesQuery } from './types';
import { CreateOfficeDto } from './dto/create-office-dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@AppRoles([Roles.MANAGER])
@Controller('offices')
export class OfficesController {
  constructor(private readonly officeService: OfficesService) {}

  @Get()
  async findAll(@Query() query: getAllOfficesQuery) {
    return await this.officeService.findAll(query);
  }

  @Get('/free')
  async findFreeOffices(@Query() query: getFreeOfficesQuery) {
    return await this.officeService.findFreeOffices(query);
  }

  @Post()
  async create(@Body() createOfficeDto: CreateOfficeDto) {
    return await this.officeService.create(createOfficeDto);
  }

  @Get(':id')
  async findOne(@Param() params: IdParams) {
    return await this.officeService.findOne(params.id);
  }
}

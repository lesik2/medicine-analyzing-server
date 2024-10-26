import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
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
import { getFreeOfficesQuery } from './types';
import { CreateOfficeDto } from './dto/create-office-dto';
import { UpdateOfficeDto } from './dto/update-office-dto';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetAllOfficesQueryDto } from './dto/get-all-offices-query-dto';
import { GetAllOfficeResponseDto } from './dto/get-all-office0response-dto';
import { Office } from './models/office.entity';

@UseGuards(JwtAuthGuard, RolesGuard)
@AppRoles([Roles.MANAGER])
@ApiTags('offices')
@Controller('offices')
export class OfficesController {
  constructor(private readonly officeService: OfficesService) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve all offices with optional filters' })
  @ApiResponse({
    status: 200,
    description: 'List of offices retrieved successfully.',
    type: GetAllOfficeResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request. The input data is invalid.',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found. No offices match the provided filters.',
  })
  async findAllFilters(
    @Query() query: GetAllOfficesQueryDto,
  ): Promise<GetAllOfficeResponseDto> {
    return await this.officeService.findAllFilters(query);
  }

  @Get('/free')
  async findFreeOffices(@Query() query: getFreeOfficesQuery) {
    return await this.officeService.findFreeOffices(query);
  }

  @Post()
  async create(@Body() createOfficeDto: CreateOfficeDto) {
    return await this.officeService.create(createOfficeDto);
  }

  @Patch()
  async update(@Body() updateOfficeDto: UpdateOfficeDto) {
    return await this.officeService.update(updateOfficeDto);
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    description: 'The unique identifier of the office.',
    required: true,
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Office retrieved successfully.',
    type: Office,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found. Office with the specified ID does not exist.',
  })
  async findOne(@Param() params: IdParams) {
    return await this.officeService.findOne(params.id);
  }
}

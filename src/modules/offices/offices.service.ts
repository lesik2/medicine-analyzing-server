import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Office } from './models/office.entity';
import { ErrorMessages } from '@/common/error-messages';
import { GetAllOfficeResponse, getAllOfficesQuery } from './types';
import { CreateOfficeDto } from './dto/create-office-dto';
import { getOfficeStatus } from './utils/getOfficeStatus';

@Injectable()
export class OfficesService {
  constructor(
    @InjectRepository(Office)
    private officesRepository: Repository<Office>,
  ) {}

  async create(createOfficeDto: CreateOfficeDto) {
    const newOffice = this.officesRepository.create({
      ...createOfficeDto,
    });

    const savedOffice = await this.officesRepository.save(newOffice);
    return savedOffice;
  }

  async findAll(query: getAllOfficesQuery): Promise<GetAllOfficeResponse> {
    const { sortKey, sortDirection, page, perPage } = query;

    const officeQuery = this.officesRepository
      .createQueryBuilder('office')
      .leftJoinAndSelect('office.doctors', 'doctor')
      .select([
        'office.id',
        'office.number',
        'office.specialty',
        'doctor.id',
        'doctor.name',
        'doctor.surname',
        'doctor.patronymic',
        'doctor.typeOfShifts',
      ]);

    if (sortKey) {
      officeQuery.orderBy(`office.${sortKey}`, sortDirection);
    }

    const total = await officeQuery.getCount();

    officeQuery.take(perPage);
    officeQuery.skip(page * perPage);

    const offices = await officeQuery.getMany();

    return {
      items: offices.map((office) => ({
        id: office.id,
        number: office.number,
        specialty: office.specialty,
        doctors: office.doctors.map((doctor) => ({
          fullName: `${doctor.surname} ${doctor.name} ${doctor.patronymic}`,
          typeOfShifts: doctor.typeOfShifts,
          id: doctor.id,
        })),
        status: getOfficeStatus(office.doctors),
      })),
      total,
    };
  }

  async findOne(officeId: string) {
    const office = await this.officesRepository.findOne({
      where: { id: officeId },
    });

    if (!office) {
      throw new NotFoundException(ErrorMessages.OFFICE_NOT_FOUND);
    }
    return office;
  }
}

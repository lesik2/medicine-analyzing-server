import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Office } from './models/office.entity';
import { ErrorMessages } from '@/common/error-messages';
import {
  FreeOffice,
  GetAllOfficeResponse,
  getAllOfficesQuery,
  getFreeOfficesQuery,
} from './types';
import { CreateOfficeDto } from './dto/create-office-dto';
import { getOfficeStatus } from './utils/getOfficeStatus';
import { TypesOfShifts } from '@/types';

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
  async findFreeOffices(query: getFreeOfficesQuery): Promise<FreeOffice[]> {
    const { specialty, typeOfShifts } = query;

    const offices = await this.officesRepository
      .createQueryBuilder('office')
      .leftJoinAndSelect('office.doctors', 'doctor')
      .where('office.specialty = :specialty', { specialty })
      .select(['office.id', 'office.number', 'doctor.typeOfShifts'])
      .getMany();

    const officesShifts = offices.map((office) => {
      const shiftAvailability = {
        [TypesOfShifts.FIRST_SHIFT]: true,
        [TypesOfShifts.SECOND_SHIFT]: true,
      };

      office.doctors.forEach((doctor) => {
        if (doctor.typeOfShifts === TypesOfShifts.FIRST_SHIFT) {
          shiftAvailability[TypesOfShifts.FIRST_SHIFT] = false;
        }
        if (doctor.typeOfShifts === TypesOfShifts.SECOND_SHIFT) {
          shiftAvailability[TypesOfShifts.SECOND_SHIFT] = false;
        }
        if (doctor.typeOfShifts === TypesOfShifts.FULL_SHIFT) {
          shiftAvailability[TypesOfShifts.FIRST_SHIFT] = false;
          shiftAvailability[TypesOfShifts.SECOND_SHIFT] = false;
        }
      });

      const availableShifts = Object.keys(shiftAvailability).filter(
        (shift) => shiftAvailability[shift],
      );

      return {
        key: office.id,
        value: {
          id: office.id,
          number: office.number,
          specialty: office.specialty,
          availableShifts,
        },
      };
    });

    return officesShifts.filter((office) => {
      if (typeOfShifts === TypesOfShifts.FULL_SHIFT) {
        return office.value.availableShifts.length === 2;
      }
      return office.value.availableShifts.includes(typeOfShifts);
    });
  }

  async findAll(query: getAllOfficesQuery): Promise<GetAllOfficeResponse> {
    const { sortKey, sortDirection, page, perPage, filters } = query;

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
    if (filters?.specialty) {
      officeQuery.where('office.specialty = :specialty', {
        specialty: filters.specialty,
      });
    }

    const total = await officeQuery.getCount();

    officeQuery.take(perPage);
    officeQuery.skip(page * perPage);

    const offices = await officeQuery.getMany();

    const getAllOfficeResponse = {
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

    if (filters?.status) {
      const filteredItems = getAllOfficeResponse.items.filter(
        (item) => item.status === filters.status,
      );
      return {
        total: filteredItems.length,
        items: filteredItems,
      };
    }

    return getAllOfficeResponse;
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

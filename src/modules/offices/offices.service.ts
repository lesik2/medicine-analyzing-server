import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Office } from './models/office.entity';
import { ErrorMessages } from '@/common/error-messages';
import { FreeOffice, GetAllOfficeResponse, getFreeOfficesQuery } from './types';
import { CreateOfficeDto } from './dto/create-office-dto';
import { Status, TypesOfShifts } from '@/types';
import { UpdateOfficeDto } from './dto/update-office-dto';
import { DoctorsService } from '../doctors/doctors.service';
import { Doctor } from '../doctors/models/doctor.entity';
import { GetAllOfficesQueryDto } from './dto/get-all-offices-query-dto';

@Injectable()
export class OfficesService {
  private shiftOrder = {
    [TypesOfShifts.FIRST_SHIFT]: 1,
    [TypesOfShifts.SECOND_SHIFT]: 2,
    [TypesOfShifts.FULL_SHIFT]: 3,
  };
  constructor(
    @InjectRepository(Office)
    private officesRepository: Repository<Office>,
    @Inject(forwardRef(() => DoctorsService))
    private readonly doctorsService: DoctorsService,
  ) {}

  sortDoctorsByShift(doctors: Doctor[]): Doctor[] {
    return doctors.sort(
      (a, b) =>
        this.shiftOrder[a.typeOfShifts] - this.shiftOrder[b.typeOfShifts],
    );
  }

  async create(createOfficeDto: CreateOfficeDto) {
    const isOfficeNumberExist = await this.officesRepository.findOne({
      where: { number: createOfficeDto.number },
    });

    if (isOfficeNumberExist) {
      throw new BadRequestException(ErrorMessages.OFFICE_NUMBER_ALREADY_EXISTS);
    }
    const newOffice = this.officesRepository.create({
      ...createOfficeDto,
    });

    const savedOffice = await this.officesRepository.save(newOffice);
    return savedOffice;
  }

  async update(updateOfficeDto: UpdateOfficeDto) {
    const office = await this.findOne(updateOfficeDto.id);

    if (office.number !== updateOfficeDto.number) {
      const isOfficeNumberExist = await this.officesRepository.findOne({
        where: { number: updateOfficeDto.number },
      });

      if (isOfficeNumberExist) {
        throw new BadRequestException(
          ErrorMessages.OFFICE_NUMBER_ALREADY_EXISTS,
        );
      }
    }
    if (updateOfficeDto.specialty !== office.specialty) {
      const isDoctorsExist =
        await this.doctorsService.isOfficeIncludesDoctors(office);
      if (isDoctorsExist) {
        throw new BadRequestException(ErrorMessages.DOCTORS_EXISTS_IN_OFFICE);
      }
    }

    const result = await this.officesRepository.update(
      { id: updateOfficeDto.id },
      {
        number: updateOfficeDto.number,
        specialty: updateOfficeDto.specialty,
      },
    );

    if (result.affected === 0) {
      throw new NotFoundException(ErrorMessages.OFFICE_NOT_FOUND);
    }
    return result;
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
      const availableShifts = this.getAvailableShifts(office.doctors);

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

  async findAll() {
    return await this.officesRepository
      .createQueryBuilder('office')
      .leftJoinAndSelect('office.doctors', 'doctor')
      .getMany();
  }

  async findAllFilters(
    query: GetAllOfficesQueryDto,
  ): Promise<GetAllOfficeResponse> {
    const { sortKey, sortDirection, page, perPage, filters } = query;

    const officeQuery = this.officesRepository
      .createQueryBuilder('office')
      .leftJoinAndSelect('office.doctors', 'doctor')
      .select([
        'office.id',
        'office.number',
        'office.specialty',
        'office.status',
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

    if (filters?.status) {
      officeQuery.andWhere('office.status = :status', {
        status: filters.status,
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
        doctors: this.sortDoctorsByShift(office.doctors).map((doctor) => ({
          fullName: `${doctor.surname} ${doctor.name} ${doctor.patronymic}`,
          typeOfShifts: doctor.typeOfShifts,
          id: doctor.id,
        })),
        status: office.status,
      })),
      total,
    };

    return getAllOfficeResponse;
  }

  async findOne(officeId?: string): Promise<Office | null> {
    if (!officeId) {
      return null;
    }
    const office = await this.officesRepository
      .createQueryBuilder('office')
      .leftJoinAndSelect('office.doctors', 'doctor')
      .where('office.id = :officeId', { officeId })
      .getOne();
    return office;
  }

  async updateOfficeStatus(officeId: string) {
    const office = await this.findOne(officeId);
    const status = this.getOfficeStatus(office.doctors);
    const result = await this.officesRepository.update(
      { id: officeId },
      {
        status: status,
      },
    );

    if (result.affected === 0) {
      throw new NotFoundException(ErrorMessages.OFFICE_NOT_FOUND);
    }
    return result;
  }

  getOfficeStatus(doctors: Doctor[]) {
    const hasFullShift = doctors.some(
      (doctor) => doctor.typeOfShifts === TypesOfShifts.FULL_SHIFT,
    );
    const hasFirstShift = doctors.some(
      (doctor) => doctor.typeOfShifts === TypesOfShifts.FIRST_SHIFT,
    );
    const hasSecondShift = doctors.some(
      (doctor) => doctor.typeOfShifts === TypesOfShifts.SECOND_SHIFT,
    );
    if (hasFullShift || (hasFirstShift && hasSecondShift)) {
      return Status.FILLED;
    } else if (doctors.length === 1) {
      return Status.PARTIALLY_FILLED;
    } else {
      return Status.EMPTY;
    }
  }
  getAvailableShifts(doctors: Doctor[]) {
    const shiftAvailability = {
      [TypesOfShifts.FIRST_SHIFT]: true,
      [TypesOfShifts.SECOND_SHIFT]: true,
    };

    doctors.forEach((doctor) => {
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

    return Object.keys(shiftAvailability).filter(
      (shift) => shiftAvailability[shift],
    );
  }
}

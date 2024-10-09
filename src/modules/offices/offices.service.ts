import { Departments } from '@/types';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Office } from './models/office.entity';
import { ErrorMessages } from '@/common/error-messages';

@Injectable()
export class OfficesService {
  constructor(
    @InjectRepository(Office)
    private officesRepository: Repository<Office>,
  ) {}

  async findAll(department?: Departments[] | Departments) {
    if (!department) {
      return await this.officesRepository.find();
    }

    const departmentsArray = Array.isArray(department)
      ? department
      : [department];
    const offices = await this.officesRepository.find({
      where: {
        department: In(departmentsArray),
      },
    });
    return offices;
  }

  async findOne(officeId: string) {
    const patient = await this.officesRepository.findOne({
      where: { id: officeId },
    });

    if (!patient) {
      throw new NotFoundException(ErrorMessages.OFFICE_NOT_FOUND);
    }
    return patient;
  }
}

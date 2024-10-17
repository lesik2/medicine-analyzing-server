import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Patient } from './models/patient.entity';
import { Repository } from 'typeorm';
import { CreatePatientDto } from './dto/create-patient-dto';
import { AgeCategory } from '@/types';
import { ErrorMessages } from '@/common/error-messages';
import { UsersService } from '../users/users.service';
import { UpdatePatientDto } from './dto/update-patient-dto';
import * as moment from 'moment';
import { patientsProfile } from './constants';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient)
    private patientsRepository: Repository<Patient>,
    private readonly usersService: UsersService,
  ) {}

  async create(
    createPatientDto: CreatePatientDto,
    userId: string,
  ): Promise<Patient> {
    this.validatePatientAge(
      createPatientDto.dateOfBirth,
      createPatientDto.ageCategory,
    );

    const user = await this.usersService.findOne({ id: userId });

    const patient = this.patientsRepository.create({
      ...createPatientDto,
      user,
    });

    return await this.patientsRepository.save(patient);
  }

  async delete(patientId: string) {
    const result = await this.patientsRepository.delete({ id: patientId });
    if (result.affected === 0) {
      throw new NotFoundException('ErrorMessages.PATIENT_NOT_FOUND');
    }
    return result;
  }

  async update(updatePatientDto: UpdatePatientDto) {
    const result = await this.patientsRepository.update(
      { id: updatePatientDto.id },
      updatePatientDto,
    );

    if (result.affected === 0) {
      throw new NotFoundException(ErrorMessages.PATIENT_NOT_FOUND);
    }
    return result;
  }

  async findAll(userId: string) {
    const patients = await this.patientsRepository.find({
      where: { user: { id: userId } },
    });

    return patientsProfile.map((profile) => {
      const patient = patients.find(
        (item) =>
          item.ageCategory === profile.ageCategory && profile.patient === null,
      );

      return {
        ...profile,
        patient: patient || null,
      };
    });
  }

  async findOne(userId: string, patientId: string) {
    const patient = await this.patientsRepository.findOne({
      where: { user: { id: userId }, id: patientId },
    });

    if (!patient) {
      throw new NotFoundException(ErrorMessages.PATIENT_NOT_FOUND);
    }
    return patient;
  }

  private validatePatientAge(
    dateOfBirth: string,
    ageCategory: AgeCategory,
  ): void {
    console.log(moment);
    const birthDate = moment(dateOfBirth, moment.ISO_8601);
    const age = moment().diff(moment(birthDate), 'years');

    if (ageCategory === AgeCategory.CHILD && age > 18) {
      throw new BadRequestException(ErrorMessages.PATIENT_CHILD_OLDER_ERROR);
    }

    if (ageCategory === AgeCategory.ADULT && age < 18) {
      throw new BadRequestException(ErrorMessages.PATIENT_ADULT_YOUNGER_ERROR);
    }
  }
}

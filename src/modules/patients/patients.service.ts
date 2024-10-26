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

moment.locale('ru');

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
    const date = new Date(createPatientDto.dateOfBirth);

    const user = await this.usersService.findOne({ id: userId });
    const amountOfPatient = await this.getAmountOfPatients(userId);
    const patient = this.patientsRepository.create({
      gender: createPatientDto.gender,
      name: createPatientDto.name,
      surname: createPatientDto.surname,
      patronymic: createPatientDto.patronymic,
      ageCategory: createPatientDto.ageCategory,
      dateOfBirth: date,
      user,
      active: amountOfPatient === 0 ? true : false,
    });

    await this.patientsRepository.save(patient);

    return { ...patient, user: undefined };
  }

  async delete(patientId: string) {
    const result = await this.patientsRepository.delete({ id: patientId });
    if (result.affected === 0) {
      throw new NotFoundException('ErrorMessages.PATIENT_NOT_FOUND');
    }
    return result;
  }

  async update(updatePatientDto: UpdatePatientDto) {
    this.validatePatientAge(
      updatePatientDto.dateOfBirth,
      updatePatientDto.ageCategory,
    );
    const date = new Date(updatePatientDto.dateOfBirth);
    const result = await this.patientsRepository.update(
      { id: updatePatientDto.id },
      {
        name: updatePatientDto.name,
        surname: updatePatientDto.surname,
        patronymic: updatePatientDto.patronymic,
        gender: updatePatientDto.gender,
        dateOfBirth: date,
      },
    );

    if (result.affected === 0) {
      throw new NotFoundException(ErrorMessages.PATIENT_NOT_FOUND);
    }
    return result;
  }
  async findAll(userId: string) {
    const patients = await this.patientsRepository.find({
      where: { user: { id: userId } },
      order: {
        dateOfBirth: 'ASC',
      },
    });

    return patients.map((patient) => {
      return {
        id: patient.id,
        active: patient.active,
        dateOfBirth: moment(patient.dateOfBirth).format('D MMMM YYYY [г.]'),
        fullName: `${patient.surname} ${patient.name} ${patient.patronymic}`,
      };
    });
  }

  async findAllPattern(userId: string) {
    const patients = await this.patientsRepository.find({
      where: { user: { id: userId } },
      order: {
        dateOfBirth: 'ASC',
      },
    });

    const assignedPatients = new Set();

    return patientsProfile.map((profile) => {
      const patient = patients.find(
        (item) =>
          item.ageCategory === profile.ageCategory &&
          profile.patient === null &&
          !assignedPatients.has(item.id),
      );

      if (patient) {
        assignedPatients.add(patient.id);

        return {
          ...profile,
          patient: {
            ...patient,
            dateOfBirth: moment(patient.dateOfBirth).format('D MMMM YYYY [г.]'),
            fullName: `${patient.surname} ${patient.name} ${patient.patronymic}`,
          },
        };
      }

      return {
        ...profile,
        patient: null,
      };
    });
  }

  async getAmountOfPatients(userId: string) {
    const patients = await this.patientsRepository.find({
      where: { user: { id: userId } },
    });

    return patients.length;
  }

  async findOne(patientId: string) {
    const patient = await this.patientsRepository.findOne({
      where: { id: patientId },
    });

    if (!patient) {
      throw new NotFoundException(ErrorMessages.PATIENT_NOT_FOUND);
    }
    return patient;
  }

  async changeActive(patientId: string) {
    const patients = await this.patientsRepository.find();

    const updatedPatients = patients.map((patient) => {
      if (patient.id === patientId) {
        return { ...patient, active: true };
      } else {
        return { ...patient, active: false };
      }
    });

    await Promise.all(
      updatedPatients.map((patient) => this.patientsRepository.save(patient)),
    );
  }

  private validatePatientAge(
    dateOfBirth: string,
    ageCategory: AgeCategory,
  ): void {
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

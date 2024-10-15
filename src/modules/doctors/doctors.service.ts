import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Doctor } from './models/doctor.entity';
import { Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';
import { OfficesService } from '../offices/offices.service';
import { CreateDoctorDto } from './dto/create-doctor-dto';
import { Roles } from '@/types';
import { UsersService } from '../users/users.service';
import { getAllDoctorsQuery, GetAllDoctorsResponse } from './types';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectRepository(Doctor)
    private doctorsRepository: Repository<Doctor>,
    private readonly authService: AuthService,
    private readonly officeService: OfficesService,
    private readonly userService: UsersService,
  ) {}

  async create(createDoctorDto: CreateDoctorDto) {
    const newPassword = this.authService.generateStrongPassword();

    const excludeUserPassword = await this.authService.signUp({
      name: createDoctorDto.name,
      surname: createDoctorDto.surname,
      email: createDoctorDto.email,
      password: newPassword,
      role: Roles.DOCTOR,
    });

    const user = await this.userService.findOne({ id: excludeUserPassword.id });

    const office = await this.officeService.findOne(createDoctorDto.officeId);

    const doctor = this.doctorsRepository.create({
      name: createDoctorDto.name,
      surname: createDoctorDto.surname,
      patronymic: createDoctorDto.patronymic,
      specialty: createDoctorDto.specialty,
      typeOfShifts: createDoctorDto.typeOfShifts,
      office: office,
      user: user,
    });

    const savedDoctor = await this.doctorsRepository.save(doctor);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = savedDoctor.user;
    const updatedSavedDoctor = {
      ...savedDoctor,
      user: userWithoutPassword,
    };

    return updatedSavedDoctor;
  }

  async findAll(query: getAllDoctorsQuery): Promise<GetAllDoctorsResponse> {
    const { sortKey, sortDirection, page, perPage, filters } = query;

    const doctorsQuery = this.doctorsRepository
      .createQueryBuilder('doctor')
      .leftJoinAndSelect('doctor.office', 'office')
      .select(['doctor', 'office.number']);

    if (sortKey) {
      if (sortKey === 'officeNumber') {
        doctorsQuery.orderBy('office.number', sortDirection);
      } else {
        doctorsQuery.orderBy(`doctor.${sortKey}`, sortDirection);
      }
    }
    if (filters?.specialty) {
      doctorsQuery.where('doctor.specialty = :specialty', {
        specialty: filters.specialty,
      });
    }

    if (filters?.typeOfShifts) {
      doctorsQuery.andWhere('doctor.typeOfShifts = :typeOfShifts', {
        typeOfShifts: filters.typeOfShifts,
      });
    }

    const total = await doctorsQuery.getCount();

    doctorsQuery.take(perPage);
    doctorsQuery.skip(page * perPage);

    const doctors = await doctorsQuery.getMany();

    return {
      items: doctors.map((doctor) => ({
        id: doctor.id,
        fullName: `${doctor.surname} ${doctor.name} ${doctor.patronymic}`,
        specialty: doctor.specialty,
        typeOfShifts: doctor.typeOfShifts,
        officeNumber: doctor.office.number,
      })),
      total,
    };
  }
}

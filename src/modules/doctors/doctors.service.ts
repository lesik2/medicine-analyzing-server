import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Doctor } from './models/doctor.entity';
import { Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';
import { OfficesService } from '../offices/offices.service';
import { CreateDoctorDto } from './dto/create-doctor-dto';
import { Roles, Specialty, TypesOfShifts } from '@/types';
import { UsersService } from '../users/users.service';
import {
  DoctorResponse,
  getAllDoctorsQuery,
  GetAllDoctorsResponse,
} from './types';
import { Office } from '../offices/models/office.entity';
import { UpdateDoctorDto } from './dto/update-office-dto';
import { ErrorMessages } from '@/common/error-messages';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectRepository(Doctor)
    private doctorsRepository: Repository<Doctor>,
    private readonly authService: AuthService,
    @Inject(forwardRef(() => OfficesService))
    private readonly officeService: OfficesService,
    private readonly userService: UsersService,
  ) {}

  validateOffice(
    specialty: Specialty,
    typeOfShifts: TypesOfShifts,
    office: Office,
    doctorId?: string,
  ) {
    if (office.specialty !== specialty) {
      throw new BadRequestException(
        ErrorMessages.OFFICE_SPECIALTY_DIFFER_FROM_DOCTOR,
      );
    }
    const amountOfShifts = 2;
    const oneShiftInOffice = 1;
    const availableShifts = this.officeService.getAvailableShifts(
      office.doctors,
    );

    if (
      typeOfShifts === TypesOfShifts.FULL_SHIFT &&
      availableShifts.length === amountOfShifts
    ) {
      return;
    }

    if (
      office.doctors.length === oneShiftInOffice &&
      office.doctors[0].id === doctorId
    ) {
      return;
    }

    if (availableShifts.includes(typeOfShifts)) {
      return;
    }
    throw new BadRequestException(ErrorMessages.OFFICE_NO_AVAILABLE_SHIFTS);
  }

  async create(createDoctorDto: CreateDoctorDto) {
    const office: Office | null = await this.officeService.findOne(
      createDoctorDto.officeId,
    );
    if (office) {
      this.validateOffice(
        createDoctorDto.specialty,
        createDoctorDto.typeOfShifts,
        office,
      );
    }

    const newPassword = this.authService.generateStrongPassword();

    const excludeUserPassword = await this.authService.signUp({
      name: createDoctorDto.name,
      surname: createDoctorDto.surname,
      email: createDoctorDto.email,
      password: newPassword,
      role: Roles.DOCTOR,
    });

    const user = await this.userService.findOne({ id: excludeUserPassword.id });

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

    if (office) {
      await this.officeService.updateOfficeStatus(office.id);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = savedDoctor.user;
    const updatedSavedDoctor = {
      ...savedDoctor,
      user: userWithoutPassword,
    };

    return updatedSavedDoctor;
  }

  async update(updateDoctorDto: UpdateDoctorDto) {
    const office: Office | null = await this.officeService.findOne(
      updateDoctorDto.officeId,
    );

    if (office) {
      this.validateOffice(
        updateDoctorDto.specialty,
        updateDoctorDto.typeOfShifts,
        office,
        updateDoctorDto.id,
      );
    }
    const doctorData = await this.doctorsRepository
      .createQueryBuilder('doctor')
      .leftJoinAndSelect('doctor.user', 'user')
      .leftJoinAndSelect('doctor.office', 'office')
      .where('doctor.id = :doctorId', { doctorId: updateDoctorDto.id })
      .getOne();

    if (doctorData.user.email !== updateDoctorDto.email) {
      const isEmailAlreadyExists = await this.userService.findOne({
        email: updateDoctorDto.email,
      });

      if (isEmailAlreadyExists) {
        throw new BadRequestException(ErrorMessages.USER_ALREADY_EXIST);
      }

      await this.userService.update(doctorData.user.id, {
        email: updateDoctorDto.email,
      });
    }

    const result = await this.doctorsRepository.update(
      { id: updateDoctorDto.id },
      {
        name: updateDoctorDto.name,
        surname: updateDoctorDto.surname,
        patronymic: updateDoctorDto.patronymic,
        typeOfShifts: updateDoctorDto.typeOfShifts,
        specialty: updateDoctorDto.specialty,
        office: office,
      },
    );

    await this.officeService.updateOfficeStatus(
      office ? office.id : doctorData.office.id,
    );

    if (result.affected === 0) {
      throw new NotFoundException(ErrorMessages.DOCTOR_NOT_FOUND);
    }
    return result;
  }

  async findDoctorsBySpecialty(specialty: Specialty) {
    const doctorQuery = this.doctorsRepository
      .createQueryBuilder('doctor')
      .leftJoinAndSelect('doctor.office', 'office')
      .where('doctor.specialty = :specialty', { specialty })
      .select(['doctor', 'office.number']);

    const doctors = await doctorQuery.getMany();

    return doctors
      .filter((doctor) => doctor.office)
      .map((doctor) => ({
        id: doctor.id,
        fullName: `${doctor.surname} ${doctor.name} ${doctor.patronymic}`,
        officeNumber: doctor.office ? doctor.office.number : null,
        specialty: doctor.specialty,
      }));
  }

  async findAllFilters(
    query: getAllDoctorsQuery,
  ): Promise<GetAllDoctorsResponse> {
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
    if (filters?.number) {
      doctorsQuery.andWhere('office.number = :number', {
        number: filters.number,
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
        officeNumber: doctor.office ? doctor.office.number : null,
      })),
      total,
    };
  }

  async findAll() {
    const doctors = await this.doctorsRepository
      .createQueryBuilder('doctor')
      .leftJoinAndSelect('doctor.office', 'office')
      .getMany();

    return doctors.filter((doctor) => doctor.office);
  }

  async isOfficeIncludesDoctors(office: Office) {
    const doctors = await this.doctorsRepository.find({
      where: { office: office },
    });

    return doctors.length > 0;
  }

  async findDoctorById(doctorId: string) {
    if (!doctorId) {
      return null;
    }
    const doctor = await this.doctorsRepository.findOne({
      where: { id: doctorId },
      relations: ['office'],
    });
    if (!doctor) {
      throw new NotFoundException(ErrorMessages.DOCTOR_NOT_FOUND);
    }
    return doctor;
  }

  async findOneDoctorWithAvailableShifts(
    doctorId: string,
  ): Promise<DoctorResponse> {
    const doctorData = await this.doctorsRepository
      .createQueryBuilder('doctor')
      .leftJoinAndSelect('doctor.user', 'user')
      .leftJoinAndSelect('doctor.office', 'office')
      .leftJoinAndSelect('office.doctors', 'colleagues')
      .where('doctor.id = :doctorId', { doctorId })
      .getOne();

    const availableShifts = doctorData.office
      ? this.officeService.getAvailableShifts(doctorData.office.doctors)
      : [];

    return {
      id: doctorData.id,
      email: doctorData.user.email,
      fullName: `${doctorData.surname} ${doctorData.name} ${doctorData.patronymic}`,
      specialty: doctorData.specialty,
      typeOfShifts: doctorData.typeOfShifts,
      office: doctorData.office
        ? {
            key: doctorData.office.id,
            value: {
              number: doctorData.office.number,
              id: doctorData.office.id,
              specialty: doctorData.office.specialty,
              availableShifts: availableShifts,
            },
          }
        : null,
    };
  }
}

import { Injectable } from '@nestjs/common';
import { AppointmentResponseByPatient, getTimeSlotsQuery } from './types';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from './models/appointment.entity';
import { Between, Repository } from 'typeorm';
import { DoctorsService } from '../doctors/doctors.service';
import * as moment from 'moment';
import { getTimeOfShifts } from '@/common/getTimeOfShifts';
import { getTimeForCareOfSpecialty } from '@/common/getTimeForCareOfSpecialty';
import { CreateAppointmentDto } from './dto/create-appointment-dto';
import { PatientsService } from '../patients/patients.service';
import { FULL_DATE_MOMENT_FORMAT } from '@/common/date';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    private readonly doctorsService: DoctorsService,
    private readonly patientsService: PatientsService,
  ) {}

  async createAppointmentDto(createAppointmentDto: CreateAppointmentDto) {
    const { patientId, doctorId, dateAndTime } = createAppointmentDto;

    const doctor = await this.doctorsService.findDoctorById(doctorId);
    const patient = await this.patientsService.findOne(patientId);

    const appointment = this.appointmentRepository.create({
      doctor,
      patient,
      dateAndTime,
    });

    return await this.appointmentRepository.save(appointment);
  }

  async getAppointments(userId: string): Promise<AppointmentResponseByPatient> {
    const patients = await this.patientsService.findAll(userId);
    const todayStart = moment().startOf('day').toDate();

    const patientIds = patients.map((patient) => patient.id);

    const allAppointments = await this.appointmentRepository
      .createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.patient', 'patient')
      .leftJoinAndSelect('appointment.doctor', 'doctor')
      .leftJoinAndSelect('doctor.office', 'office')
      .where('patient.id IN (:...patientIds)', { patientIds })
      .orderBy('appointment.dateAndTime', 'ASC')
      .getMany();

    const formattedAppointments = allAppointments.map((appointment) => {
      const appointmentDate = moment(appointment.dateAndTime);
      return {
        id: appointment.id,
        dateAndTime: appointmentDate.format(FULL_DATE_MOMENT_FORMAT),
        patientFullName: `${appointment.patient.surname} ${appointment.patient.name} ${appointment.patient.patronymic}`,
        doctorFullName: `${appointment.doctor.surname} ${appointment.doctor.name} ${appointment.doctor.patronymic}`,
        specialty: appointment.doctor.specialty,
        officeNumber: appointment.doctor.office.number,
      };
    });

    const futureAppointments = formattedAppointments.filter((appointment) =>
      moment(
        appointment.dateAndTime,
        FULL_DATE_MOMENT_FORMAT,
        true,
      ).isSameOrAfter(todayStart),
    );

    const previousAppointments = formattedAppointments
      .filter((appointment) =>
        moment(appointment.dateAndTime, FULL_DATE_MOMENT_FORMAT, true).isBefore(
          todayStart,
        ),
      )
      .reverse();

    return {
      upcoming: futureAppointments,
      history: previousAppointments,
    };
  }

  async getTimeSlots(query: getTimeSlotsQuery) {
    const { doctorId, date } = query;

    const selectedDate = moment(date);

    if (selectedDate.day() === 0 || selectedDate.day() === 6) {
      return [];
    }

    const doctor = await this.doctorsService.findDoctorById(doctorId);

    const startOfDay = moment(date).startOf('day').toDate();
    const endOfDay = moment(date).endOf('day').toDate();

    const existingAppointments = await this.appointmentRepository.find({
      where: {
        doctor: { id: doctorId },
        dateAndTime: Between(startOfDay, endOfDay),
      },
    });

    const availableSlots = [];

    const { start, end } = getTimeOfShifts[doctor.typeOfShifts];
    const careTime = getTimeForCareOfSpecialty[doctor.specialty];

    const startTime = moment(`${date} ${start}`, 'YYYY-MM-DD HH:mm');
    const endTime = moment(`${date} ${end}`, 'YYYY-MM-DD HH:mm');

    while (startTime.isBefore(endTime)) {
      const isSlotOccupied = existingAppointments.some((appointment) => {
        const appointmentDate = moment(appointment.dateAndTime);
        return (
          appointmentDate.isSame(startTime, 'hour') &&
          appointmentDate.isSame(startTime, 'minute')
        );
      });

      if (!isSlotOccupied) {
        availableSlots.push(startTime.format('HH:mm'));
      }

      startTime.add(careTime, 'minutes');
    }

    return availableSlots;
  }
}

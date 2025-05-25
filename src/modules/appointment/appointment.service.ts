import { BadRequestException, Injectable } from '@nestjs/common';
import {
  AppointmentResponseByPatient,
  AppointmentStatus,
  getTimeSlotsQuery,
  getWorkloadQuery,
} from './types';
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
import { TypesOfShifts } from '@/types';
import { Doctor } from '../doctors/models/doctor.entity';
import { OfficesService } from '../offices/offices.service';
import { Office } from '../offices/models/office.entity';
import { MailService } from '../mail/mail.service';
import { ExcludeUserPassword } from '@/types/excludeUserPassword';
import { appointmentConfirmationMailSubject } from '../auth/constants';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    private readonly doctorsService: DoctorsService,
    private readonly patientsService: PatientsService,
    private readonly officesService: OfficesService,
    private readonly mailService: MailService,
  ) {}

  async createAppointmentDto(
    user: ExcludeUserPassword,
    createAppointmentDto: CreateAppointmentDto,
  ) {
    const { patientId, doctorId, dateAndTime } = createAppointmentDto;

    const doctor = await this.doctorsService.findDoctorById(doctorId);
    const patient = await this.patientsService.findOne(patientId);

    const appointment = this.appointmentRepository.create({
      doctor,
      patient,
      dateAndTime,
    });

    const savedAppointment = await this.appointmentRepository.save(appointment);

    this.mailService.sendMail({
      to: user.email,
      subject: appointmentConfirmationMailSubject,
      template: 'createAppointment',
      context: {
        patientName: patient.name,
        patientSurname: patient.surname,
        patientPatronymic: patient.patronymic,
        appointmentTime: moment(dateAndTime).format('D MMMM YYYY HH:mm'),
        doctorFullName: `${doctor.surname} ${doctor.name} ${doctor.patronymic}`,
        doctorSpecialty: doctor.specialty,
        officeNumber: doctor.office.number.toString(),
      },
    });

    return savedAppointment;
  }

  async getAppointments(userId: string): Promise<AppointmentResponseByPatient> {
    const patients = await this.patientsService.findAll(userId);

    if (patients.length === 0) {
      return {
        upcoming: [],
        history: [],
      };
    }

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
        status: appointment.status,
      };
    });

    const futureAppointments = formattedAppointments.filter(
      (appointment) =>
        moment(
          appointment.dateAndTime,
          FULL_DATE_MOMENT_FORMAT,
          true,
        ).isSameOrAfter(todayStart) &&
        appointment.status === AppointmentStatus.ACTIVE,
    );

    const previousAppointments = formattedAppointments
      .filter(
        (appointment) =>
          moment(
            appointment.dateAndTime,
            FULL_DATE_MOMENT_FORMAT,
            true,
          ).isBefore(todayStart) ||
          appointment.status === AppointmentStatus.CANCELED,
      )
      .reverse();

    return {
      upcoming: futureAppointments,
      history: previousAppointments,
    };
  }

  async getWorkload(query: getWorkloadQuery) {
    const { workloadBy } = query;
    const startDate = moment().startOf('month');
    const endDate = moment().endOf('month');
    const appointments = await this.getMonthlyAppointments();

    if (workloadBy === 'doctors') {
      return await this.getDoctorsWorkLoad(startDate, endDate, appointments);
    }

    if (workloadBy === 'offices') {
      return await this.getOfficesWorkLoad(startDate, endDate, appointments);
    }

    throw new BadRequestException();
  }

  async getDoctorsWorkLoad(
    startDate: moment.Moment,
    endDate: moment.Moment,
    appointments: Appointment[],
  ) {
    const doctors = await this.doctorsService.findAll();
    const workloadResults = [];

    while (startDate.isSameOrBefore(endDate)) {
      const dailyWorkload = [];

      for (const doctor of doctors) {
        const workloadPercentage = await this.getDoctorWorkloadForDay(
          doctor,
          startDate.toDate(),
          appointments,
        );
        dailyWorkload.push(workloadPercentage);
      }

      const averageWorkload =
        dailyWorkload.reduce((sum, record) => sum + record, 0) /
        dailyWorkload.length;

      const dayOfMonth = startDate.date();
      const dayOfWeek = startDate.format('ddd');

      workloadResults.push({
        label: `${dayOfMonth} ${dayOfWeek}`,
        value: averageWorkload,
      });

      startDate.add(1, 'days');
    }
    const totalWorkload = Math.round(
      workloadResults.reduce((sum, record) => sum + record.value, 0) /
        workloadResults.length,
    );

    return {
      total: totalWorkload,
      items: workloadResults.map((workload) => ({
        ...workload,
        value: Math.round(workload.value),
      })),
      labels: workloadResults.map((workload) => workload.label),
    };
  }

  async getOfficesWorkLoad(
    startDate: moment.Moment,
    endDate: moment.Moment,
    appointments: Appointment[],
  ) {
    const offices = await this.officesService.findAll();
    const workloadResults = [];

    while (startDate.isSameOrBefore(endDate)) {
      const dailyWorkload = [];

      for (const office of offices) {
        const workloadPercentage = await this.getOfficeWorkloadForDay(
          office,
          startDate.toDate(),
          appointments,
        );
        dailyWorkload.push(workloadPercentage);
      }

      const averageWorkload =
        dailyWorkload.reduce((sum, record) => sum + record, 0) /
        dailyWorkload.length;

      const dayOfMonth = startDate.date();
      const dayOfWeek = startDate.format('ddd');

      workloadResults.push({
        label: `${dayOfMonth} ${dayOfWeek}`,
        value: averageWorkload,
      });

      startDate.add(1, 'days');
    }

    const totalWorkload = Math.round(
      workloadResults.reduce((sum, record) => sum + record.value, 0) /
        workloadResults.length,
    );

    return {
      total: totalWorkload,
      items: workloadResults.map((workload) => ({
        ...workload,
        value: Math.round(workload.value),
      })),
      labels: workloadResults.map((workload) => workload.label),
    };
  }

  async getMonthlyAppointments() {
    const startDate = moment().startOf('month').toDate();
    const endDate = moment().endOf('month').toDate();

    return await this.appointmentRepository
      .createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.doctor', 'doctor')
      .where('appointment.dateAndTime BETWEEN :start AND :end', {
        start: startDate,
        end: endDate,
      })
      .andWhere('appointment.status = :status', {
        status: AppointmentStatus.ACTIVE,
      })
      .getMany();
  }

  getWorkingMinutes(shiftType: TypesOfShifts): number {
    const { start, end } = getTimeOfShifts[shiftType];
    const startTime = moment(start, 'HH:mm');
    const endTime = moment(end, 'HH:mm');
    return endTime.diff(startTime, 'minutes');
  }

  async getDoctorWorkloadForDay(
    doctor: Doctor,
    date: Date,
    appointments: Appointment[],
  ) {
    const doctorAppointments = appointments.filter(
      (appointment) =>
        appointment.doctor.id === doctor.id &&
        moment(appointment.dateAndTime).isSame(date, 'day'),
    );

    const totalWorkingTime = this.getWorkingMinutes(doctor.typeOfShifts);

    const appointmentTime = getTimeForCareOfSpecialty[doctor.specialty];

    const totalAppointments = doctorAppointments.length;
    const totalAppointmentTime = totalAppointments * appointmentTime;

    const workloadPercentage = (totalAppointmentTime / totalWorkingTime) * 100;
    return workloadPercentage;
  }

  async getOfficeWorkloadForDay(
    office: Office,
    date: Date,
    appointments: Appointment[],
  ) {
    const doctors = office.doctors;
    let doctorsAppointmentTimeInMinutes = 0;
    const totalTime = this.getWorkingMinutes(TypesOfShifts.FULL_SHIFT);

    for (const doctor of doctors) {
      const doctorAppointments = appointments.filter(
        (appointment) =>
          appointment.doctor.id === doctor.id &&
          moment(appointment.dateAndTime).isSame(date, 'day'),
      );

      const appointmentTime = getTimeForCareOfSpecialty[doctor.specialty];

      const totalAppointments = doctorAppointments.length;
      const totalAppointmentTime = totalAppointments * appointmentTime;
      doctorsAppointmentTimeInMinutes += totalAppointmentTime;
    }

    const workloadPercentage =
      (doctorsAppointmentTimeInMinutes / totalTime) * 100;

    return workloadPercentage;
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
        status: AppointmentStatus.ACTIVE,
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

  async cancelAppointment(
    id: string,
    user: ExcludeUserPassword,
  ): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
      relations: ['doctor', 'patient'],
    });

    if (!appointment) {
      throw new BadRequestException('Appointment not found');
    }

    appointment.status = AppointmentStatus.CANCELED;
    const canceledAppointment =
      await this.appointmentRepository.save(appointment);

    await this.mailService.sendMail({
      to: user.email,
      subject: 'Запись на прием отменена',
      template: 'cancelAppointment',
      context: {
        patientName: appointment.patient.name,
        patientSurname: appointment.patient.surname,
        patientPatronymic: appointment.patient.patronymic,
        appointmentTime: moment(appointment.dateAndTime).format(
          'D MMMM YYYY HH:mm',
        ),
        doctorFullName: `${appointment.doctor.surname} ${appointment.doctor.name} ${appointment.doctor.patronymic}`,
        doctorSpecialty: appointment.doctor.specialty,
      },
    });

    return canceledAppointment;
  }
}

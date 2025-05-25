import { Doctor } from '@/modules/doctors/models/doctor.entity';
import { Patient } from '@/modules/patients/models/patient.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { AppointmentStatus } from '../types';

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp', nullable: false })
  dateAndTime: Date;

  @ManyToOne(() => Doctor, (doctor) => doctor.appointments)
  doctor: Doctor;

  @ManyToOne(() => Patient, (patient) => patient.appointments)
  patient: Patient;

  @Column({
    type: 'enum',
    enum: AppointmentStatus,
    default: AppointmentStatus.ACTIVE,
  })
  status: AppointmentStatus;
}

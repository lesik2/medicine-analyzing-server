import { Appointment } from '@/modules/appointment/models/appointment.entity';
import { CarePatient } from '@/modules/care-patient/models/care-patient.entity';
import { Office } from '@/modules/offices/models/office.entity';
import { TimeTracking } from '@/modules/time-tracking/modules/time-tracking.entity';
import { Specialty, Gender, TIME_OF_SHIFTS, TYPES_OF_SHIFTS } from '@/types';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity()
export class Doctor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column({ nullable: true, default: null })
  patronymic: string | null;

  @Column({
    type: 'enum',
    enum: Gender,
  })
  gender: Gender;

  @Column({
    type: 'date',
  })
  dateOfBirth: Date;

  @Column()
  phone: string;

  @Column({
    type: 'enum',
    enum: Specialty,
  })
  specialty: Specialty;

  @Column()
  locality: string;

  @Column()
  address: string;

  @Column({
    type: 'enum',
    enum: TYPES_OF_SHIFTS,
  })
  typeOfShifts: TYPES_OF_SHIFTS;

  @Column({
    type: 'enum',
    enum: TIME_OF_SHIFTS,
  })
  timeOfShifts: TIME_OF_SHIFTS;

  @ManyToOne(() => Office, (office) => office.doctors)
  office: Office;

  @OneToMany(() => TimeTracking, (timeTracking) => timeTracking.doctor)
  timeTrackings: TimeTracking[];

  @OneToMany(() => Appointment, (appointment) => appointment.doctor)
  appointments: Appointment[];

  @OneToMany(() => CarePatient, (carePatient) => carePatient.doctor)
  carePatients: CarePatient[];
}

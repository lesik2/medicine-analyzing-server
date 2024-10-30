import { Appointment } from '@/modules/appointment/models/appointment.entity';
import { CarePatient } from '@/modules/care-patient/models/care-patient.entity';
import { Office } from '@/modules/offices/models/office.entity';
import { TimeTracking } from '@/modules/time-tracking/modules/time-tracking.entity';
import { User } from '@/modules/users/models/user.entity';
import { Specialty, TypesOfShifts } from '@/types';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
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
    enum: Specialty,
  })
  specialty: Specialty;

  @Column({
    type: 'enum',
    enum: TypesOfShifts,
  })
  typeOfShifts: TypesOfShifts;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @ManyToOne(() => Office, (office) => office.doctors)
  office: Office;

  @OneToMany(() => TimeTracking, (timeTracking) => timeTracking.doctor)
  timeTrackings: TimeTracking[];

  @OneToMany(() => Appointment, (appointment) => appointment.doctor)
  appointments: Appointment[];

  @OneToMany(() => CarePatient, (carePatient) => carePatient.doctor)
  carePatients: CarePatient[];
}

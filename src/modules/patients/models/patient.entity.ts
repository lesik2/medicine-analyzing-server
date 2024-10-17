import { Appointment } from '@/modules/appointment/models/appointment.entity';
import { CarePatient } from '@/modules/care-patient/models/care-patient.entity';
import { User } from '@/modules/users/models/user.entity';
import { Gender, AgeCategory } from '@/types';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity()
export class Patient {
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
    type: 'enum',
    enum: AgeCategory,
  })
  ageCategory: AgeCategory;

  @Column({
    type: 'date',
  })
  dateOfBirth: Date;

  @ManyToOne(() => User, (user) => user.patients)
  user: User;

  @OneToMany(() => Appointment, (appointment) => appointment.patient)
  appointments: Appointment[];

  @OneToMany(() => CarePatient, (carePatient) => carePatient.patient)
  carePatients: CarePatient[];
}

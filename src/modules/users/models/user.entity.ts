import { Doctor } from '@/modules/doctors/models/doctor.entity';
import { Patient } from '@/modules/patients/models/patient.entity';
import { Roles } from '@/types';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column()
  email: string;

  @Column({ default: false })
  isEmailConfirmed: boolean;

  @Column({ nullable: true, default: null })
  refreshToken: string | null;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: Roles,
    default: Roles.USER,
  })
  role: Roles;

  @OneToMany(() => Patient, (patient) => patient.user)
  patients: Patient[];

  @OneToOne(() => Doctor)
  @JoinColumn()
  doctor: Doctor;
}

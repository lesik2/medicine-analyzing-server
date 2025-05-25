import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Analysis } from './analysis.entity';
import { Patient } from '@/modules/patients/models/patient.entity';
import { Doctor } from '@/modules/doctors/models/doctor.entity';
import { Reception } from './reception.entity';
import { Conclusion } from './conclusion.entity';

@Entity()
export class CarePatient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'time' })
  startCareTime: string;

  @Column({ type: 'time', nullable: true, default: null })
  endCareTime: string | null;

  @Column({
    type: 'date',
  })
  date: Date;

  @OneToMany(() => Analysis, (analysis) => analysis.carePatient)
  analysis: Analysis[];

  @OneToMany(() => Reception, (reception) => reception.carePatient)
  receptions: Reception[];

  @ManyToOne(() => Patient, (patient) => patient.carePatients)
  patient: Patient;

  @ManyToOne(() => Doctor, (doctor) => doctor.carePatients)
  doctor: Doctor;

  @OneToOne(() => Conclusion)
  @JoinColumn()
  conclusion: Conclusion;
}

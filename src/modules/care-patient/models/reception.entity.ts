import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CarePatient } from './care-patient.entity';
import { Specialty } from '@/types';

@Entity()
export class Reception {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  preDiagnosis: string;

  @Column({ nullable: true, default: null })
  description: string | null;

  @Column()
  doctorSpecialty: Specialty;

  @ManyToOne(() => CarePatient, (carePatient) => carePatient.analysis)
  carePatient: CarePatient;
}

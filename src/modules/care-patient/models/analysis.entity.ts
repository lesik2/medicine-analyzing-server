import { AnalysisTypes } from '@/types';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { CarePatient } from './care-patient.entity';

@Entity()
export class Analysis {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true, default: true })
  time: string | null;

  @Column({
    type: 'enum',
    enum: AnalysisTypes,
  })
  analysisType: AnalysisTypes;

  @ManyToOne(() => CarePatient, (carePatient) => carePatient.analysis)
  carePatient: CarePatient;
}

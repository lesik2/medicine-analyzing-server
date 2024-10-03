import { Doctor } from '@/modules/doctors/models/doctor.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class TimeTracking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'time' })
  startWorkTime: string;

  @Column({ type: 'time', nullable: true, default: null })
  endWorkTime: string | null;

  @Column({
    type: 'date',
  })
  date: Date;

  @ManyToOne(() => Doctor, (doctor) => doctor.timeTrackings)
  doctor: Doctor;
}

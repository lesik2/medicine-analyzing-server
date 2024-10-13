import { Doctor } from '@/modules/doctors/models/doctor.entity';
import { Specialty } from '@/types';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class Office {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'integer' })
  number: number;

  @Column({
    type: 'enum',
    enum: Specialty,
  })
  specialty: Specialty;

  @OneToMany(() => Doctor, (doctor) => doctor.office)
  doctors: Doctor[];
}

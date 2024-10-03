import { Doctor } from '@/modules/doctors/models/doctor.entity';
import { Departments } from '@/types';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class Office {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  number: number;

  @Column({
    type: 'enum',
    enum: Departments,
  })
  specialty: Departments;

  @OneToMany(() => Doctor, (doctor) => doctor.office)
  doctors: Doctor[];
}

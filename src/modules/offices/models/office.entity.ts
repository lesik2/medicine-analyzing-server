import { Doctor } from '@/modules/doctors/models/doctor.entity';
import { Specialty, Status } from '@/types';
import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class Office {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: 'The unique identifier of the office.',
    example: 'e5b33c5e-1b9f-4f73-9b5e-9b83e55a9c56',
  })
  id: string;

  @Column({ type: 'integer' })
  @ApiProperty({
    description: 'The number of the office.',
    example: 101,
  })
  number: number;

  @ApiProperty({
    description: 'The specialty of the office.',
    enum: Specialty,
  })
  @Column({
    type: 'enum',
    enum: Specialty,
  })
  specialty: Specialty;

  @ApiProperty({
    description: 'List of doctors associated with the office.',
    type: [String],
  })
  @OneToMany(() => Doctor, (doctor) => doctor.office)
  doctors: Doctor[];

  @ApiProperty({
    description: 'The current status of the office.',
    enum: Status,
    default: Status.EMPTY,
  })
  @Column({
    type: 'enum',
    enum: Status,
    default: Status.EMPTY,
  })
  status: Status;
}

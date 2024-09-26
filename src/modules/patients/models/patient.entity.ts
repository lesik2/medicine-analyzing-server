import { User } from '@/modules/users/models/user.entity';
import { Gender, TypeOfPatient } from '@/types';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class Patient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column({ nullable: true, default: null })
  patronymic: string;

  @Column({
    type: 'enum',
    enum: Gender,
  })
  gender: Gender;

  @Column({
    type: 'enum',
    enum: TypeOfPatient,
  })
  ageCategory: TypeOfPatient;

  @Column({
    type: 'date',
  })
  dateOfBirth: Date;

  @Column()
  phone: string;

  @Column()
  locality: string;

  @Column()
  address: string;

  @ManyToOne(() => User, (user) => user.patients)
  user: User;
}

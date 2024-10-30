import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Conclusion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  diagnosis: string;

  @Column({ nullable: true, default: null })
  description: string | null;
}

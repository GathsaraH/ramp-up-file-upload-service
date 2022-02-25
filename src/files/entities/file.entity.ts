import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('student')
export class File {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;
  @Column()
  gender: string;
  @Column()
  address: string;
  @Column()
  mobile_no: string;
  @Column()
  dob: Date;
}

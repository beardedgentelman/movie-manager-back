import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';

@Entity('movie')
export class MovieEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'title', type: 'varchar', length: 255 })
  title: string;

  @Column({ name: 'publishingYear', type: 'int' })
  publishing_year: number;

  @Column({ name: 'poster', type: 'varchar', length: 255, nullable: true })
  poster: string;

  @ManyToOne(() => UserEntity, (user) => user.movies, { onDelete: 'CASCADE' })
  user: UserEntity;
}

import { CreateDateColumn, UpdateDateColumn, JoinColumn, ManyToOne } from 'typeorm';

import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('post')
export class Post extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  content!: string;

  @Column()
  imageUrl!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => User, (user) => user.posts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'creatorId' })
  creator!: User;

  @Column()
  creatorId!: number;
}

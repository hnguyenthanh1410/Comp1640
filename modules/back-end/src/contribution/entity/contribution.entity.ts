import { Comment } from 'src/comment/entity/comment.entity';
import { Period } from 'src/period/entity/period.entity';
import { Status } from 'src/status/entity/status.entity';
import { User } from 'src/user/entity/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Contribution {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  createdAt: Date;

  @Column({ type: 'simple-array', nullable: true })
  files: string[];

  @Column({ type: 'simple-array', nullable: true })
  photos: string[];

  @Column({ type: 'json', nullable: true })
  status: Status;

  @Column({ type: 'json', nullable: true })
  period: Period;

  @OneToMany(() => Comment, (comment) => comment.contribution)
  comments?: Comment[] | null;

  @ManyToOne(() => User, (user) => user.ownerContribution, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'author' })
  author?: User;
}

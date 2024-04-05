import { Contribution } from 'src/contribution/entity/contribution.entity';
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
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  content: string;

  @Column()
  createdAt?: Date;

  @Column()
  updatedAt?: Date;

  @ManyToOne(() => Contribution, (contribution) => contribution.comments)
  @JoinColumn({ name: 'contribution' })
  contribution?: Contribution;

  @ManyToOne(() => User, (user) => user.ownerComment, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'author' })
  author?: User;

  @ManyToOne(() => Comment, (parent) => parent.children, { nullable: true })
  parent?: Comment | null;

  @OneToMany(() => Comment, (child) => child.parent)
  children?: Comment[];
}

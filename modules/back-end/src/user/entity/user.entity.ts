import { IsOptional, IsString } from 'class-validator';
import { Comment } from 'src/comment/entity/comment.entity';
import { Contribution } from 'src/contribution/entity/contribution.entity';
import { Faculty } from 'src/faculty/entity/faculty.entity';
import { Role } from 'src/role/entity/role.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  password?: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @ManyToOne(() => Faculty, (faculty) => faculty.facultyUser)
  @Column({ type: 'json', nullable: true })
  faculty: Faculty;

  @ManyToOne(() => Role, (role) => role.roleUser)
  @Column({ type: 'json', nullable: true })
  role: Role;

  @Column({ type: 'longtext', nullable: true })
  avatar?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  address?: string;

  @OneToMany(() => Contribution, (contribution) => contribution.author)
  ownerContribution?: Contribution;

  @OneToMany(() => Comment, (comment) => comment.author, { cascade: true })
  ownerComment: Comment[];

  @Column({ type: 'longtext', nullable: true })
  refreshToken?: string;
}

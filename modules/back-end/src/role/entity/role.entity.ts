import { User } from 'src/user/entity/user.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

export enum RoleName {
  ADMIN = 1,
  MARKETING_COORDINATOR = 2,
  MARKETING_MANAGER = 3,
  STUDENT = 4,
  GUEST = 5,
}

export const ROLES_KEY = 'roles';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ unique: true })
  name: RoleName;

  @Column()
  description: string;

  @OneToMany(() => User, (user) => user.role)
  roleUser?: User[];
}

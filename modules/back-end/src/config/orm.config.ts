import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Comment } from 'src/comment/entity/comment.entity';
import { Contribution } from 'src/contribution/entity/contribution.entity';
import { Faculty } from 'src/faculty/entity/faculty.entity';
import { Period } from 'src/period/entity/period.entity';
import { Role } from 'src/role/entity/role.entity';
import { Status } from 'src/status/entity/status.entity';
import { User } from 'src/user/entity/user.entity';
export default registerAs(
  'orm.config',
  (): TypeOrmModuleOptions => ({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [User, Faculty, Role, Period, Status, Contribution, Comment],
    synchronize: true,
  }),
);

import { SetMetadata } from '@nestjs/common';
import { ROLES_KEY, RoleName } from './entity/role.entity';

export const CheckRole = (...role: RoleName[]) => SetMetadata(ROLES_KEY, role);

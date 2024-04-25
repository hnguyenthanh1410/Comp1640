import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY, Role } from './entity/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    const userInfo = await this.userRepository.findOne({
      where: [{ id: user.sub }],
    });

    const isRole = requiredRoles.includes(userInfo.role.name);

    if (isRole) return true;

    return requiredRoles.some((role) => userInfo.role === role);
  }
}

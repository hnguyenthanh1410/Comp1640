import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY, Role } from './entity/role.entity';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();

    const isMarketingManager = requiredRoles.includes(user.role.name);

    if (isMarketingManager) return true;

    const isAdmin = requiredRoles.includes(user.role.name);
    if (isAdmin) return true;

    const isMarketingCoordinator = requiredRoles.includes(user.role.name);
    if (isMarketingCoordinator) return true;

    return requiredRoles.some((role) => user?.role?.name === role);
  }
}

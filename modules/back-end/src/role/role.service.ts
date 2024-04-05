import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role, RoleName } from './entity/role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  private getRolesBaseQuery() {
    return this.roleRepository.createQueryBuilder('e').orderBy('e.id', 'DESC');
  }

  public async getAllRoles() {
    return await this.getRolesBaseQuery().getMany();
  }

  public async getRoleByName(name: RoleName) {
    return await this.roleRepository.findOne({
      where: {
        name,
      },
    });
  }
}

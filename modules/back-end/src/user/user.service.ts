import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { GetUserResponse } from './dtos/create.user.dto';
import { RoleService } from 'src/role/role.service';
import { MediaService } from 'src/media/media.service';
import { UpdateRoleRequest, UpdateUserRequest } from './dtos/update.role.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly roleService: RoleService,
    private readonly mediaService: MediaService,
  ) {}

  private getUserBaseQuery() {
    return this.userRepository.createQueryBuilder('e').orderBy('e.id', 'DESC');
  }

  private async checkExistedUser(id: string): Promise<User> {
    const user = await this.getUserBaseQuery()
      .andWhere('e.id = :id', { id })
      .getOne();

    if (!user) {
      throw new BadRequestException('User not found!');
    }
    return user;
  }

  public async getUserByEmail(
    email: string,
  ): Promise<GetUserResponse | undefined> {
    const user = await this.getUserBaseQuery()
      .andWhere('e.email = :email', {
        email,
      })
      .getOne();

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      faculty: user.faculty,
      role: user.role,
    };
  }

  public async getAllUsers(): Promise<GetUserResponse[]> {
    const userList = await this.getUserBaseQuery()
      .andWhere("JSON_extract(role, '$.name') != 1")
      .getMany();
    return userList.map((user) => {
      return {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        faculty: user.faculty,
        role: user.role,
      };
    });
  }

  public async getUserDetail(id: string): Promise<GetUserResponse | undefined> {
    const user = await this.checkExistedUser(id);

    return user;
  }

  public async getUserInfo(username: string) {
    const rawUser = await this.getUserBaseQuery()
      .andWhere('e.username = :username', { username })
      .getOne();

    const user = {};

    Object.keys(rawUser).forEach((key) => {
      if (key !== 'refreshToken' && key !== 'password') {
        Object.assign(user, {
          [key]: rawUser[key],
        });
      }
    });

    return user;
  }

  public async updateRole(user: GetUserResponse, payload: UpdateRoleRequest) {
    const role = await this.roleService.getRoleByName(payload.roleName);

    return await this.userRepository.save({
      ...user,
      role,
    });
  }

  public async updateUserInformation(
    user: GetUserResponse,
    image: Express.Multer.File,
    payload: UpdateUserRequest,
  ) {
    if (image) {
      const avatar = await this.mediaService.upload(image);
      payload.avatar = avatar;
    }

    return await this.userRepository.save({
      ...user,
      firstName: payload.firstName,
      lastName: payload.lastName,
      phone: payload.phone,
      address: payload.address,
      ...(image && { avatar: payload.avatar }),
      refreshToken: payload.refreshToken,
    });
  }

  public async deleteUser(id: string) {
    const existedUser = await this.checkExistedUser(id);

    if (!existedUser)
      throw new BadRequestException('No exist user with the id');

    await this.userRepository.remove(existedUser);
  }
}

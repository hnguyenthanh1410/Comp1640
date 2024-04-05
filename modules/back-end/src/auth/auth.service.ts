/* eslint-disable @typescript-eslint/no-var-requires */
import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import {
  CreateUserRequest,
  GetUserResponse,
} from 'src/user/dtos/create.user.dto';
import { Faculty } from 'src/faculty/entity/faculty.entity';
import { Role, RoleName } from 'src/role/entity/role.entity';

@Injectable()
export class AuthService {
  private codeVerify: number;
  private emailUser: string;
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Faculty)
    private readonly facultyRepository: Repository<Faculty>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  public getToken(user: User): string {
    return this.jwtService.sign({
      username: user.username,
      sub: user.id,
    });
  }

  public async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  public async createNewUser(createUserRequest: CreateUserRequest) {
    const user = new User();

    if (createUserRequest.password !== createUserRequest.retypedPassword)
      throw new BadRequestException('Re-password is not the same as password');

    const existedUser = await this.userRepository.findOne({
      where: [
        { username: createUserRequest.username },
        { email: createUserRequest.email },
      ],
    });

    if (existedUser)
      throw new BadRequestException('Username or Email is existed !');

    user.username = createUserRequest.username;
    user.password = await this.hashPassword(createUserRequest.password);
    user.email = createUserRequest.email;
    user.firstName = createUserRequest.firstName;
    user.lastName = createUserRequest.lastName;

    const userFaculty = await this.facultyRepository.findOne({
      where: {
        name: createUserRequest.faculty,
      },
    });

    user.faculty = userFaculty;

    let studentRole = await this.roleRepository.findOne({
      where: { name: RoleName.STUDENT },
    });

    if (!studentRole) {
      studentRole = new Role();
      studentRole.name = RoleName.STUDENT;
      studentRole.description = 'student';
      studentRole = await this.roleRepository.save(studentRole);
    }

    user.role = studentRole;

    const savedUser = await this.userRepository.save(user);
    const token = this.getToken(user);

    return {
      user: {
        id: savedUser.id,
        username: savedUser.username,
        email: savedUser.email,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        faculty: savedUser.faculty,
        role: savedUser.role,
      },
      token,
    };
  }

  public async sendCodeResetPassword(email: string): Promise<object> {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const nodemailer = require('nodemailer');
    const account = await this.userService.getUserByEmail(email);

    if (!account) throw new BadRequestException('Account not found !');

    this.emailUser = account.email;
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'danquene123@gmail.com',
        pass: 'kccb yxli mhxx jicf',
      },
      port: 587,
      secure: false,
      requireTLS: true,
    });

    this.codeVerify = Math.floor(Math.random() * 900000) + 100000;
    const mailOptions = {
      from: 'danquene123@gmail.com',
      to: email,
      subject: 'Sending a code for user',
      text: 'New message',
      html: `<p style="font-size: '20px'; font-weight: 600">Your code is: ${this.codeVerify}</p>`,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      return info;
    } catch (error) {
      throw new BadRequestException('Error sending email !');
    }
  }

  public checkCodeVerify(code: number): boolean {
    if (code !== this.codeVerify)
      throw new BadRequestException('The code is not valid !');

    return true;
  }

  public async resetPassword(password: string): Promise<GetUserResponse> {
    const user = await this.userService.getUserByEmail(this.emailUser);

    if (!user) throw new BadRequestException('Account not found !');

    const accountAfterResetPass = await this.userRepository.save({
      ...user,
      password,
    });

    return {
      id: accountAfterResetPass.id,
      username: accountAfterResetPass.username,
      email: accountAfterResetPass.email,
      firstName: accountAfterResetPass.firstName,
      lastName: accountAfterResetPass.lastName,
    };
  }
}

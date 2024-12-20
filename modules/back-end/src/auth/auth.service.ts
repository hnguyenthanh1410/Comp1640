/* eslint-disable @typescript-eslint/no-var-requires */
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';
import { UserService } from 'src/user/user.service';
import { Equal, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import {
  CreateUserRequest,
  GetUserResponse,
} from 'src/user/dtos/create.user.dto';
import { Faculty } from 'src/faculty/entity/faculty.entity';
import { Role, RoleName } from 'src/role/entity/role.entity';
import { SignInRequest } from 'src/user/dtos/signIn.dto';
import { stringify } from 'querystring';

let codeVerify: number;
@Injectable()
export class AuthService {
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

  async getTokens(userId: string, username: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: process.env.JWT_ACCESS_SECRET,
          expiresIn: '1h',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: process.env.JWT_REFRESH_SECRET,
          expiresIn: '3h',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  public async validateUser(username: string, password: string): Promise<User> {
    const userInfo = await this.userRepository.findOne({
      where: [{ username }],
    });

	if (!userInfo) return;

    if (await bcrypt.compare(password, userInfo.password)) return userInfo;
  }

  public async hashData(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  public async createNewUser(createUserRequest: CreateUserRequest) {
    const user = new User();

    if (createUserRequest.password !== createUserRequest.retypedPassword)
      throw new BadRequestException('Re-password is not the same as password');

    const existedUser = await this.validateUser(
      createUserRequest.username,
      createUserRequest.password,
    );
	

    if (existedUser)
      throw new BadRequestException('Username or Email is existed !');

    user.username = createUserRequest.username;
    user.password = await this.hashData(createUserRequest.password);
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

    if (!createUserRequest.role) {
      user.role = studentRole;
    } else {
      const role = await this.roleRepository.findOne({
        where: { name: parseInt(RoleName[createUserRequest.role]) },
      });

      user.role = role;
      if (role.name === RoleName.MARKETING_MANAGER || role.name === RoleName.ADMIN)
        user.faculty = undefined;
    }

    const savedUser = await this.userRepository.save(user);

    const tokens = await this.getTokens(user.id, user.username);
    this.updateRefreshToken(user.id, tokens.refreshToken);

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
      ...tokens,
    };
  }

  public async login(signInRequest: SignInRequest) {
    const user = await this.userRepository.findOne({
      where: [{ username: signInRequest.username }],
    });

    if (user && (await bcrypt.compare(signInRequest.password, user.password))) {
      const tokens = await this.getTokens(user.id, user.username);

      this.updateRefreshToken(user.id, tokens.refreshToken);
      return tokens;
    } else if (
      user &&
      (await !bcrypt.compare(signInRequest.password, user.password))
    ) {
      throw new BadRequestException(
        'Invaild email or password has been provided.',
      );
    } else {
      throw new UnauthorizedException('Unauthorized');
    }
  }

  public async refreshToken(username, refreshToken) {
    const user = await this.userRepository.findOne({
      where: [{ username }],
    });

    const refreshTokenMatch = await bcrypt.compare(
      refreshToken.replace('Bearer', '').trim(),
      user.refreshToken,
    );

    if (!refreshTokenMatch) throw new ForbiddenException('Forbidden Access');

    const tokens = await this.getTokens(user.id, user.username);

    this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  public async sendCodeResetPassword(email: string) {
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

    codeVerify = Math.floor(Math.random() * 900000) + 100000;
    const mailOptions = {
      from: 'danquene123@gmail.com',
      to: email,
      subject: 'Sending a code for user',
      text: 'New message',
      html: `<p style="font-size: '20px'; font-weight: 600">Your code is: ${codeVerify}</p>`,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
    } catch (error) {
      throw new BadRequestException('Error sending email !');
    }
  }

  public checkCodeVerify(code: number): boolean {
	console.log(code, codeVerify);
	
    if (code !== codeVerify)
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

  public async logout(userId: string) {
    await this.userRepository.update(userId, {
      refreshToken: null,
    });
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.userRepository.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }
}

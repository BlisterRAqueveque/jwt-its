import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { LoginUserDto } from './dto/login.dto';
import { AuthService } from './auth/auth.service';
import { PaginatorDto } from '@/common';
import { envs } from '@/configuration';
import { Role } from './dto/role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<UpdateUserDto>,
    private readonly auth: AuthService,
  ) {
    this.registerAdmin();
  }

  /**
   * @description
   * Creates a admin user, if doesn't exist
   */
  private async registerAdmin() {
    const admin = this.getByUsername('admin@admin.com');
    if (!admin) {
      this.register({
        username: envs.admin_user,
        password: envs.admin_pass,
        role: Role.admin,
        firstName: 'Admin',
        lastName: 'Admin',
      });
      this.logger.log('Admin user created');
      return;
    }
    this.logger.log('Admin user already exist');
  }

  private readonly logger = new Logger('Users');

  /**
   * @description check user information for login
   * @param login login user information
   * @returns generated token
   */
  async login(login: LoginUserDto): Promise<string | any> {
    try {
      const { username, password } = login;
      const user = await this.getByUsername(username);

      if (!user) throw new NotFoundException('User not found');

      const checkPass = await this.auth.comparePassword(
        password,
        user.password,
      );

      if (!checkPass) throw new UnauthorizedException('Wrong credentials');

      const data = await this.auth.generateJwt({
        ...user,
        password: '****',
      });

      this.logger.log(`User logged: ${user.username}`);

      return data;
    } catch (err: any) {
      this.logger.error(err);
      if (err instanceof QueryFailedError)
        throw new HttpException(err.message, err.driverError);
      throw new HttpException(err.message, err.status);
    }
  }
  /**
   * @description
   * Get user by username
   */
  private async getByUsername(username: string) {
    try {
      const user = await this.repo.findOne({ where: { username } });
      if (!user) throw new NotFoundException('User not found');
      return user;
    } catch (err) {
      this.logger.error(err);
      if (err instanceof QueryFailedError)
        throw new HttpException(err.message, err.driverError);
      throw new HttpException(err.message, err.status);
    }
  }
  /**
   * @description
   * Register a new user
   */
  async register(createUserDto: CreateUserDto) {
    try {
      const user = await this.repo.findOne({
        where: { username: createUserDto.username },
      });

      if (user) throw new ConflictException('Username already taken');
      else {
        const hashPassword = await this.auth.hashPassword(
          createUserDto.password,
        );

        createUserDto.password = hashPassword;
        createUserDto.username = createUserDto.username;

        const new_user = {
          ...(await this.repo.save(createUserDto)),
          password: '****',
        };
        return new_user;
      }
    } catch (err: any) {
      this.logger.error(err);
      if (err instanceof QueryFailedError)
        throw new HttpException(err.message, err.driverError);
      throw new HttpException(err.message, err.status);
    }
  }
  /**
   * @description
   * Refresh user's token
   */
  async refreshToken(token: string) {
    try {
      const isJwt = await this.auth.isJwt(token);

      if (!isJwt) throw new BadRequestException('Token not valid');

      const decodedToken = await this.auth.verifyJwt(token);
      const user = await this.findOne(decodedToken.sub);

      const text = await this.auth.generateJwt({ ...user, password: '****' });

      return text;
    } catch (err) {
      this.logger.log(err);
      if (err instanceof QueryFailedError)
        throw new HttpException(err.message, err.driverError);
      throw new HttpException(err.message, err.status);
    }
  }

  /**
   * @description
   * Get all  users
   */
  findAll(paginator: PaginatorDto) {
    const { page, perPage, sortBy } = paginator;
    return this.repo.find({
      skip: page !== undefined ? (page - 1) * perPage : 0,
      take: perPage,
      order: {
        id: sortBy === 'ASC' ? 'ASC' : sortBy === 'DESC' ? 'DESC' : 'DESC',
      },
      select: ['id', 'firstName', 'lastName', 'username', 'role'],
    });
  }

  /**
   * @description
   * Get one user by id
   */
  async findOne(id: number) {
    try {
      if (!id) throw new BadRequestException('ID not provided');

      const user = await this.repo.findOne({ where: { id } });

      if (!user) throw new NotFoundException('User not found');

      return user;
    } catch (err) {
      this.logger.error(err);
      if (err instanceof QueryFailedError)
        throw new HttpException(err.message, err.driverError);
      throw new HttpException(err.message, err.status);
    }
  }
}

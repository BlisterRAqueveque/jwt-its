import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { Role } from './role.enum';

export class CreateUserDto {
  @IsOptional()
  @IsString()
  firstName: string;
  @IsOptional()
  @IsString()
  lastName: string;

  @IsEmail()
  username: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsEnum(Role)
  role: Role = Role.user;
}

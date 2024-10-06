import { PaginatorDto } from '@/common';
import { RolesGuard } from '@/guards/role.guard';
import {
  Body,
  Controller,
  Get,
  Headers,
  HttpStatus,
  Param,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth/auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly auth: AuthService,
  ) {}

  //? Auth methods ------------------------------------------------->
  @Post('auth/login')
  async login(@Body() login: LoginUserDto, @Res() res: Response) {
    const token = await this.usersService.login(login);
    res.status(HttpStatus.OK).json({ ok: true, text: token });
  }
  @Post('auth/register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.register(createUserDto);
  }
  @Get('auth/refresh-token')
  async refreshToken(
    @Headers('authorization') header: string,
    @Res() res: Response,
  ) {
    const text = await this.usersService.refreshToken(header.split(' ')[1]);
    res.status(HttpStatus.OK).json({ ok: true, text });
  }
  //? Auth methods ------------------------------------------------->

  /**
   * @description
   * Return all users
   * @tutorial
   *    Only admin users can activate this endpoint
   */
  @Get()
  @UseGuards(RolesGuard)
  findAll(@Query() paginator: PaginatorDto) {
    return this.usersService.findAll(paginator);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }
}

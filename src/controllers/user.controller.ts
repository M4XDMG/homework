import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { UserService } from '../services/user.service';
import { UserCreateDto, UserDto, UserPatchDto } from '../model';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  list(): Promise<UserDto[]> {
    return this.userService.list();
  }

  @Get("/nested")
  nested(): Promise<UserDto[]> {
    return this.userService.list();
  }

  @Get(":id")
  get(@Param("id") id: string): Promise<UserDto> {
    return this.userService.get(id);
  }

  @Post()
  singUp(@Body() data: UserCreateDto): Promise<UserDto> {
    return this.userService.singUp(data);
  }

  @Get("/random/:count/:herocount")
  generateRandomUsersHeroes(
    @Param('count') count: number,
    @Param('herocount') heroCount?: number): Promise<UserDto[]> {
    return this.userService.generateRandom(+count, +heroCount);
  }

  @Get("/random/:count")
  generateRandomUsers(@Param('count') count): Promise<UserDto[]> {
    return this.userService.generateRandom(+count);
  }

  @Delete(":id")
  delete(@Param('id') id: string): Promise<UserDto> {
    return this.userService.delete(id);
  }

  @Patch(':id')
  patch(@Body() data: UserPatchDto, @Param('id') id: string) {
    return this.userService.patch(id, data);
  }
}

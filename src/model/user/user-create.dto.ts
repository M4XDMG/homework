import {IsNotEmpty, IsString} from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class UserCreateDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  userName: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  email: string;
}

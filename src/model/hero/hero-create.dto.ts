import {IsNotEmpty, IsNumber, IsString, Max, Min, MinLength} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class HeroCreateDto {
  @ApiProperty()
  @IsNotEmpty()
  @MinLength(5)
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(9999)
  age: number;

  @ApiProperty()
  @IsNotEmpty()
  owner: string
}

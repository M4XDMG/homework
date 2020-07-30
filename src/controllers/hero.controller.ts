import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post, Req, UseGuards,
} from '@nestjs/common';

import { HeroService } from '../services/hero.service';
import { HeroCreateDto, HeroDto, HeroPatchDto } from '../model';
import { ApiTags } from '@nestjs/swagger';
import {AuthGuard} from "@nestjs/passport";

@Controller('hero')
@ApiTags("hero")
@UseGuards(AuthGuard())
export class HeroController {
  constructor(private heroService: HeroService) {}

  @Get()
  list(@Req() req): Promise<HeroDto[]> {
    return this.heroService.listByUser(req.user);
  }

  @Get("/:id")
  get(@Param('id') id: string, @Req() req): Promise<any> {
    return this.heroService.getByUser(id, req.user);
  }

  @Get("/random/:count")
  generateRandom(@Param('count') count: number, @Req() req): Promise<HeroDto[]> {
    return this.heroService.generateRandom(+count, req.user);
  }

  @Post()
  post(@Body() heroCreateDto: HeroCreateDto, @Req() req) {
    return this.heroService.create(heroCreateDto, req.user)
  }

  @Patch('/:id')
  patch(@Body() data: HeroPatchDto, @Param('id') id: string, @Req() req) {
    return this.heroService.patchByUser(id, data, req.user);
  }

  @Delete("/:id")
  delete(@Param('id') id: string, @Req() req): Promise<HeroDto> {
    return this.heroService.deleteByUser(id, req.user);
  }
}

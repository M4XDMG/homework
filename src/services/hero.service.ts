import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import * as Chance from "chance";

import { Hero, HeroCreateDto, HeroDto, HeroPatchDto, UserDto } from '../model';
import { HeroRepository } from '../repositories';

@Injectable()
export class HeroService {

  private chance;

  constructor(private heroRepository: HeroRepository) {
    this.chance = Chance.Chance()
  }

  async getHeroesDtoByUser(userDto: UserDto): Promise<HeroDto[]> {
    const list  = await this.heroRepository.list();
    return list.filter(hero => hero.owner === userDto.id)
  }

  async getNestedHeroesByUser(userDto: UserDto): Promise<Hero[]> {
    const list = await this.heroRepository.list();
    return list.filter(hero => hero.owner === userDto.id).map(hero => this.convertToHero(hero))
  }

  private convertToHero(heroDto: HeroDto): Hero {
    return {...heroDto, owner:undefined};
  }

  async list(): Promise<HeroDto[]> {
    return await this.heroRepository.list();
  }

  async listByUser(user: UserDto): Promise<HeroDto[]> {
    return (await this.heroRepository.list()).filter(hero => hero.owner = user.id);
  }

  create(heroCreateDto: HeroCreateDto, user: UserDto): Promise<HeroDto> {
    return this.heroRepository.create(heroCreateDto, user);
  }

  async get(id: string): Promise<HeroDto> {
    return await this.heroRepository.get(id);;
  }

  async getByUser(id: string, user: UserDto): Promise<HeroDto> {
    const heroDto = await this.heroRepository.get(id);
    if (heroDto.owner !== user.id) {
      throw new ForbiddenException();
    }
    return heroDto;
  }

  patch(id: string, heroPatchDto: HeroPatchDto): Promise<Hero> {
    return this.heroRepository.patch(id, heroPatchDto);
  }

  delete(id: string): Promise<HeroDto> {
    return this.heroRepository.delete(id);
  }

  patchByUser(id: string, heroPatchDto: HeroPatchDto, user: UserDto): Promise<Hero> {
    this.getByUser(id, user);
    return this.heroRepository.patch(id, heroPatchDto);
  }

  deleteByUser(id: string, user: UserDto): Promise<HeroDto> {
    this.getByUser(id, user);
    return this.heroRepository.delete(id);
  }

  async generateRandom(count: number, user: UserDto): Promise<HeroDto[]> {
    const heroList: HeroDto[] = [];
    for (let i = 0; i < count; i++) {
      const heroDto = await this.create(
        {
          name: this.chance.last(),
          age: this.chance.d100(),
          owner: user.id
        },
        user
      );
      heroList.push(heroDto);
    }
    return heroList;
  }

}

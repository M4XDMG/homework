import { ImATeapotException, Injectable } from '@nestjs/common';
import { Hero, User, UserCreateDto, UserDto, UserPatchDto } from '../model';
import { UserRepository } from '../repositories';
import { HeroService } from './hero.service';
import * as Chance from "chance";

@Injectable()
export class UserService {

  private chance;

  constructor(
    private userRepository: UserRepository,
    private heroService: HeroService,
  ) {
    this.chance = Chance.Chance();
  }

  async userNameList(): Promise<string[]> {
    return (await this.list()).map(user => user.userName);
  }

  async nestedHeroes(): Promise<Hero[]> {
    const heroDtos = await this.heroService.list();
    const heroes: Hero[] = [];
    for (let i = 0; i < heroDtos.length; i++) {
      heroes.push({...(await this.heroService.get(heroDtos[i].id)),
        owner: await this.nestedById(heroDtos[i].owner)});
    }
    return heroes;
  }

  private convertToUser(user: UserDto): User {
    return {...user, heroList:[]};
  }

  async nested(): Promise<User[]> {
    const userDtos = await this.userRepository.list();
    const users: User[] = [];
    for (let i = 0; i < userDtos.length; i++) {
      users.push(await this.extractedUser(userDtos[i]));
    }
    return users;
  }

  async nestedById(id: string): Promise<User> {
    return await this.extractedUser(await this.userRepository.get(id));
  }

  async list(): Promise<UserDto[]> {
    const userDtos = await this.userRepository.list();
    for (let i = 0; i < userDtos.length; i++) {
      userDtos[i] = await this.extractedUserDto(userDtos[i]);
      //todo:
      //??? ez itt miért nem egy promise lista?
    }
    //??? return userDtos.map(value => this.extracted(value));
    return userDtos;
  }

  async findByUserName(userName: string): Promise<UserDto> {
    const userDtos = (await this.list()).filter(user => user.userName === userName);
    if (userDtos.length === 1) {
      return userDtos[0];
    }
    return null;
  }

  async get(id: string): Promise<UserDto> {
    return await this.extractedUserDto(await this.userRepository.get(id));
  }

  async extractedUser(user: UserDto): Promise<User> {
    return {
      ...user,
      heroList: (await this.heroService.getNestedHeroesByUser(user)),
    }
  }

  async extractedUserDto(user: UserDto): Promise<UserDto> {
    return {
      ...user,
      heroList: (await this.heroService.getHeroesDtoByUser(user)).map(hero => hero.id),
    }
  }

  async singUp(data: UserCreateDto): Promise<UserDto> {
    if (await this.userRepository.isUsernameExists(data.userName)) {
      throw new ImATeapotException("Username already exists");
    }
    return this.userRepository.signUp(data);
  }

  async generateRandom(count: number, heroCount?: number, empireCount?: number): Promise<UserDto[]> {
    const userList: UserDto[] = [];
    for (let i = 0; i < count; i++) {
      let userDto = await this.createNewRandomUser();
      if (heroCount) {
        const heroDtoList = await this.heroService.generateRandom(heroCount, userDto);
        userDto = {
          ...userDto,
          heroList: heroDtoList.map(hero => hero.id)
        };
      }

      userList.push(userDto);
    }
    return userList;

  }

  private async createNewRandomUser() {
    const name: string = this.chance.name();
    let userName: string = name.split(" ")[0]
    let nameRandomIndex = 0;
    while (await this.userRepository.isUsernameExists(userName)) {
      userName = name.split(" ")[0] + ++nameRandomIndex;
    }
    const password: string = this.chance.word();
    const userDto: UserDto = await this.singUp(
      {
        name,
        userName,
        password,
        email: this.chance.email(),
      }
    );
    return userDto;
  }

  delete(id: string): Promise<UserDto> {
    return this.userRepository.delete(id);
  }

  patch(id: string, userPatchDto: UserPatchDto): Promise<UserDto> {
    return this.userRepository.patch(id, userPatchDto);
  }
}

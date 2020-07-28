import { HttpService, Injectable, NotFoundException } from '@nestjs/common';
import { catchError, map } from 'rxjs/operators';
import { v4 as uuidV4 } from 'uuid';

import { UserCreateDto, UserPatchDto } from '../model';
import { UserDto } from '../model/user/user.dto';
import { AxiosError } from 'axios';
import * as bcrypt from 'bcrypt';

const dbUrl = 'http://localhost:3001/user';

@Injectable()
export class UserRepository {
  constructor(
    private httpService: HttpService,
  ) {}

  list(): Promise<UserDto[]> {
    return this.httpService
      .get<UserDto[]>(dbUrl)
      .pipe(map(({data}) => data))
      .toPromise();
  }

  get(id: string): Promise<UserDto> {
    return this.httpService
      .get<UserDto>(`${dbUrl}/${id}`)
      .pipe(catchError((error: AxiosError) => {
          if (error.response.status === 404) {
            throw new NotFoundException();
          }
          throw error;
        }),
        map(({data}) => data))
      .toPromise();
  }

  async signUp(newUser: UserCreateDto): Promise<UserDto> {
    const salt = await bcrypt.genSalt();
    return this.httpService
      .post<UserDto>(dbUrl,
        {
          ...newUser,
          id: uuidV4(),
          heroList: [],
          salt,
          password: await this.hashPassword(newUser.password, salt),
        }
      )
      .pipe(map(({data}) => data))
      .toPromise();
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  delete(id: string): Promise<UserDto> {
    return this.httpService
      .delete<any>(`${dbUrl}/${id}`)
      .pipe(catchError((error: AxiosError) => {
          if (error.response.status === 404) {
            throw new NotFoundException();
          }
          throw error;
        }),
        map(({data}) => data))
      .toPromise();
  }

  patch(id: string, userPatchDto: UserPatchDto): Promise<UserDto> {
    return this.httpService
      .patch<any>(`${dbUrl}/${id}`, userPatchDto)
      .pipe(
        catchError((error: AxiosError) => {
          if (error.response.status === 404) {
            throw new NotFoundException();
          }
          throw error;
        }),
        map(({data}) => data)
      )
      .toPromise();
  }

  async isUsernameExists(userName: string) {
    return (await this.list()).filter(user => user.userName === userName).length > 0;
  }
}

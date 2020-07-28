import { HttpService, Injectable, NotFoundException } from '@nestjs/common';
import { HeroCreateDto, HeroDto, HeroPatchDto, UserDto } from '../model';
import { catchError, map } from 'rxjs/operators';
import { v4 as uuidV4 } from 'uuid';
import { AxiosError } from 'axios';

const dbUrl = 'http://localhost:3000/hero';

@Injectable()
export class HeroRepository {
  constructor(
    private httpService: HttpService,
  ) {}

  list(): Promise<HeroDto[]> {
    return this.httpService
      .get<HeroDto[]>(dbUrl)
      .pipe(map(({data}) => data))
      .toPromise();
  }

  create(heroCreateDto: HeroCreateDto, user: UserDto): Promise<HeroDto> {
    return this.httpService
      .post<HeroDto>(dbUrl,
        {...heroCreateDto, owner: user.id, id: uuidV4(), age: +heroCreateDto.age}
      )
      .pipe(map(({data}) => data))
      .toPromise();
  }

  get(id: string): Promise<HeroDto> {
    return this.httpService
      .get<HeroDto>(`${dbUrl}/${id}`)
      .pipe(catchError((error: AxiosError) => {
          if (error.response.status === 404) {
            throw new NotFoundException();
          }
          throw error;
        })
        , map(({data}) => data)
      )
      .toPromise()
  }


  patch(id: string, heroPatchDto: HeroPatchDto): Promise<any> {
    return this.httpService
      .patch<any>(`${dbUrl}/${id}`, heroPatchDto)
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

  delete(id: string): Promise<HeroDto> {
    return this.httpService
      .delete<HeroDto>(`${dbUrl}/${id}`)
      .pipe(
        catchError((error: AxiosError) => {
          if (error.request.status === 404) {
            throw new NotFoundException();
          }
          throw error;
        }),
        map(({data}) => data)
      )
      .toPromise();
  }
}
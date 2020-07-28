import {CallHandler, ExecutionContext, Injectable, NestInterceptor} from '@nestjs/common';
import {Observable, of} from 'rxjs';
import {tap} from "rxjs/operators";
import { CacheService } from '../services/cache.service';

@Injectable()
export class MyCacheInterceptor implements NestInterceptor {

    constructor(private cacheService: CacheService) {
    }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const method = context.switchToHttp().getRequest().method;
        if (method !== "GET") {
            return next.handle();
        }
        console.time("GET request")
        const url = context.switchToHttp().getRequest().url;
        const cache = this.cacheService.get(url);

        if (cache) {
            console.log("from cache: " + url);
            console.timeEnd("GET request")
            return of(cache);
        }

        return next.handle()
            .pipe(tap(response => {
                    this.cacheService.set(url, response)
                    console.log("cache put: " + url);
                    console.timeEnd("GET request")
                })
            );
    }
}

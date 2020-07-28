import {Injectable} from "@nestjs/common";

const ttl = 5000;

@Injectable()
export class CacheService {

    list: Map<string, CacheItem<any>> = new Map<string, CacheItem<any>>();

    get(key: string) : any | null {
        const cacheItem = this.list.get(key);
        if (cacheItem && cacheItem.expiration < Date.now()) {
            this.list.delete(key);
            return null;
        }
        return cacheItem;
    }

    set(key: string, data: any) {
        this.list.set(key, {data, expiration: Date.now() + ttl});
    }

}

interface CacheItem<T> {
    expiration: number;
    data: T;
}

import * as redis from 'redis';
import * as bluebird from 'bluebird';
import { Globals } from '../../utils/globals';

export class RedisClientCreator {
  public getRedisConnection(): any {
    const environments = Globals.GET_ENVIRONMENT_TYPES();
    let redisClient;
    if (process.env.NODE_ENV === environments.staging || process.env.NODE_ENV === environments.production) {
      redisClient = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_TOKEN, {
        no_ready_check: true
      }); // this creates a new client
    }
    if (process.env.NODE_ENV === environments.development) {
      redisClient = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST); // this creates a new client

    }
    bluebird.promisifyAll(redis);

    return redisClient;
  }
}
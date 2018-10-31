import * as redis from 'redis';
import * as bluebird from 'bluebird';

export class RedisClientCreator {
  public getRedisConnection(): any {
    let redisClient;
    redisClient = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST); // this creates a new client
    bluebird.promisifyAll(redis);

    return redisClient;
  }
}
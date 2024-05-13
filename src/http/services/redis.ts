import { createClient } from 'redis';
let client;

export class redisClient{
  static async connectRedis() {
    client = await createClient()
    .on('error', err => console.log('Redis Client Error', err))
    .connect();
  return client;
  }
  static get = async(key) => {
    return await client.get(key)
  }
  static set = async(key, value) => {
    return await client.set(key, value)
  }
  static setNXEX = async(key, value, time) => {
    return await client.set(key, value, "NX", "EX", time)
  }
  static incrby = async(key, value) => {
    return await client.incrBy(key, value)
  }

  static setnx = async(key, value) => {
    return await client.setNx(key, value)
  }

  static exists = async(key) => {
    return await client.exists(key)
  }

  static del = async(key) => {
    return await client.del(key)
  }

}
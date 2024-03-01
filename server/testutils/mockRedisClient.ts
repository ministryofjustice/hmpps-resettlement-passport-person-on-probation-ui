import { RedisClient } from '../data/redisClient'

export default function mockRedisClient() {
  return {
    get: jest.fn(),
    set: jest.fn(),
    on: jest.fn(),
    connect: jest.fn(),
    isOpen: true,
  } as unknown as jest.Mocked<RedisClient>
}

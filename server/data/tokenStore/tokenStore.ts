/* eslint max-classes-per-file: ["error", 2] */
import { createRedisClient, type RedisClient } from '../redisClient'

import logger from '../../../logger'
import config from '../../config'

export interface TokenStore {
  setToken(key: string, token: string, durationSeconds: number): Promise<void>
  removeToken(key: string): Promise<void>
  getToken(key: string): Promise<string>
}

export class RedisTokenStore implements TokenStore {
  constructor(private readonly client: RedisClient) {
    client.on('error', error => {
      logger.error(error, `Redis error`)
    })
  }

  private async ensureConnected() {
    if (!this.client.isOpen) {
      await this.client.connect()
    }
  }

  public async setToken(key: string, token: string, durationSeconds: number): Promise<void> {
    await this.ensureConnected()
    await this.client.set(key, token, { EX: durationSeconds })
  }

  public async getToken(key: string): Promise<string> {
    await this.ensureConnected()
    return this.client.get(key)
  }

  public async removeToken(key: string): Promise<void> {
    await this.ensureConnected()
    return this.setToken(key, '', 1)
  }
}

export class InMemoryTokenStore implements TokenStore {
  constructor(private tokenMap: Map<string, string> = new Map()) {}

  public async setToken(key: string, token: string): Promise<void> {
    this.tokenMap.set(key, token)
  }

  public async getToken(key: string): Promise<string> {
    return this.tokenMap.get(key)
  }

  public async removeToken(key: string): Promise<void> {
    return this.setToken(key, '')
  }
}

const inMemoryStore = new InMemoryTokenStore()

export const tokenStoreFactory = (): TokenStore => {
  if (config.redis.enabled) {
    logger.info('Creating new RedisTokenStore')
    return new RedisTokenStore(createRedisClient())
  }
  logger.info('Creating new InMemoryTokenStore')
  return inMemoryStore
}

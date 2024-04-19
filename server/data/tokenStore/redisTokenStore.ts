import { type RedisClient } from '../redisClient'
import logger from '../../../logger'
import { TokenStore } from './tokenStore'

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

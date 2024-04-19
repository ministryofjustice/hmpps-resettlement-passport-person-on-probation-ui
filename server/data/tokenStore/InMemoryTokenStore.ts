import { TokenStore } from './tokenStore'

export default class InMemoryTokenStore implements TokenStore {
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

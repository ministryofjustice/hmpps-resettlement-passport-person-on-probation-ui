import passport from 'passport'
import { Client, Issuer, Strategy, StrategyVerifyCallbackUserInfo, UserinfoResponse, custom } from 'openid-client'
import { RequestHandler } from 'express'
import { createPrivateKey } from 'crypto'
import config from '../config'
import logger from '../../logger'
import { tokenStoreFactory } from '../data/tokenStore/tokenStore'
import { setUserActivity } from './userActivityTracking'

passport.serializeUser((user, done) => {
  // Not used but required for Passport
  done(null, user)
})

passport.deserializeUser((user, done) => {
  // Not used but required for Passport
  done(null, user as Express.User)
})

const authenticationMiddleware = (): RequestHandler => {
  return async (req, res, next) => {
    // oddily this need to stay
    return next()
  }
}

async function init(): Promise<Client> {
  const discoveryEndpoint = `${config.apis.govukOneLogin.url}/.well-known/openid-configuration`

  const issuer = await Issuer.discover(discoveryEndpoint)
  logger.info(`GOV.UK One Login issuer discovered: ${issuer.metadata.issuer}`)

  // convert private key in PEM format to JWK
  const privateKeyJwk = createPrivateKey({
    key: config.apis.govukOneLogin.privateKey,
  }).export({ format: 'jwk' })

  const client = new issuer.Client(
    {
      client_id: config.apis.govukOneLogin.clientId,
      redirect_uris: [`${config.domain}/auth/callback`],
      response_types: ['code'],
      token_endpoint_auth_method: 'private_key_jwt',
      token_endpoint_auth_signing_alg: 'RS256',
      id_token_signed_response_alg: 'ES256',
    },
    { keys: [privateKeyJwk] },
  )

  client[custom.http_options] = () => {
    return { timeout: config.apis.govukOneLogin.timeout }
  }

  const verify: StrategyVerifyCallbackUserInfo<UserinfoResponse> = (tokenSet, userInfo, done) => {
    const tokenStore = tokenStoreFactory()
    tokenStore.setToken(userInfo.sub, tokenSet.id_token, config.session.expiryMinutes * 60)
    setUserActivity(userInfo.sub)
    return done(null, userInfo)
  }

  const strategy = new Strategy(
    {
      client,
      params: {
        scope: 'openid email phone',
        vtr: config.apis.govukOneLogin.vtr,
        ui_locales: 'en',
      },
      usePKCE: false,
      extras: {
        clientAssertionPayload: {
          aud: [...new Set([issuer.issuer, issuer.token_endpoint].filter(Boolean))],
        },
      },
    },
    verify,
  )

  passport.use('oidc', strategy)

  return client
}

export default {
  authenticationMiddleware,
  init,
}

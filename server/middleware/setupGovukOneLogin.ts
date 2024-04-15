import type { Router } from 'express'
import express from 'express'
import passport from 'passport'
import flash from 'connect-flash'
import { generators } from 'openid-client'
import jwt from 'jsonwebtoken'
import govukOneLogin from '../authentication/govukOneLogin'
import config from '../config'
import TokenStore from '../data/tokenStore/tokenStore'
import { createRedisClient } from '../data/redisClient'
import logger from '../../logger'

// Add property used in 'passport.authenticate(strategy, options, callback)'
// strategy options for 'oicd' that is missing from @types/passport
declare module 'passport' {
  interface AuthenticateOptions {
    nonce?: string
  }
}

const router = express.Router()

const handleLogout = (decodedToken: jwt.JwtPayload) => {
  const userId = decodedToken.sub
  logger.info(`Logging out user: ${userId}`)
  const tokenStore = new TokenStore(createRedisClient())
  tokenStore.removeToken(userId)
}

export default function setUpGovukOneLogin(): Router {
  govukOneLogin.init().then(client => {
    router.use(passport.initialize())
    router.use(passport.session())
    router.use(flash())

    router.get('/autherror', (req, res) => {
      res.status(401)
      return res.render('autherror')
    })

    // Endpoint to handle back-channel logout requests
    router.post('/backchannel-logout-uri', (req, res) => {
      logger.info(`Backchannel logout notification received`)
      const logoutToken = req.body.logout_token
      try {
        const decoded = jwt.verify(logoutToken, config.apis.govukOneLogin.publicKey, {
          algorithms: ['RS256'],
        }) as jwt.JwtPayload

        handleLogout(decoded)
        res.status(200).send('Logout processed')
      } catch (error) {
        logger.error(`Invalid logout token ${req.body}:`, error)
        res.status(400).send('Invalid logout token')
      }
    })

    router.get('/sign-in', (req, res, next) => {
      passport.authenticate('oidc', { nonce: generators.nonce() })(req, res, next)
    })

    router.get('/auth/callback', (req, res, next) => {
      passport.authenticate('oidc', {
        nonce: generators.nonce(),
        successRedirect: '/dashboard',
        failureRedirect: '/autherror',
        failureFlash: true,
      })(req, res, next)
    })

    router.use('/sign-out', async (req, res, next) => {
      if (req.user) {
        const tokenStore = new TokenStore(createRedisClient())
        const tokenId = await tokenStore.getToken(req.user.sub)
        req.logout(err => {
          if (err) return next(err)
          return req.session.destroy(() =>
            res.redirect(
              client.endSessionUrl({
                id_token_hint: tokenId,
                post_logout_redirect_uri: config.domain,
              }),
            ),
          )
        })
      } else res.redirect(client.endSessionUrl())
    })

    router.use(govukOneLogin.authenticationMiddleware())
  })

  return router
}

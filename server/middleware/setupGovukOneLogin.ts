import type { Router } from 'express'
import express from 'express'
import passport from 'passport'
import flash from 'connect-flash'
import { generators } from 'openid-client'
import jwt from 'jsonwebtoken'
import jwksClient from 'jwks-rsa'
import govukOneLogin from '../authentication/govukOneLogin'
import config from '../config'
import { tokenStoreFactory } from '../data/tokenStore/tokenStore'
import logger from '../../logger'

// Add property used in 'passport.authenticate(strategy, options, callback)'
// strategy options for 'oicd' that is missing from @types/passport
declare module 'passport' {
  interface AuthenticateOptions {
    nonce?: string
  }
}

const router = express.Router()

const signatureClient = jwksClient({
  jwksUri: config.apis.govukOneLogin.jwksUrl,
})

const getSigningKey = (kid: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    signatureClient.getSigningKey(kid, (err, key) => {
      if (err) {
        reject(err)
      } else {
        const signingKey = key.getPublicKey()
        resolve(signingKey)
      }
    })
  })
}

const handleLogout = (decodedToken: jwt.JwtPayload) => {
  const userId = decodedToken.sub
  logger.info(`Logging out user: ${userId}`)
  const tokenStore = tokenStoreFactory()
  tokenStore.removeToken(userId)
}

export default function setUpGovukOneLogin(): Router {
  govukOneLogin.init().then(client => {
    router.use(passport.initialize())
    router.use(passport.session())
    router.use(flash())

    router.get('/autherror', (req, res) => {
      res.status(401)
      return res.render('pages/error', { user: req.user })
    })

    // Endpoint to handle back-channel logout requests
    router.post('/backchannel-logout-uri', async (req, res) => {
      logger.info(`Backchannel logout notification received`)
      const logoutToken = req.body.logout_token
      try {
        // decode to find the signing key header (kid)
        const decodedToken = jwt.decode(logoutToken, { complete: true })
        if (!decodedToken || !decodedToken.header || !decodedToken.header.kid) {
          throw new Error('Invalid token')
        }

        // verify the signature
        const oneLoginPublicKey = await getSigningKey(decodedToken.header.kid)
        const verifiedPayload = jwt.verify(logoutToken, oneLoginPublicKey as jwt.Secret) as jwt.JwtPayload

        handleLogout(verifiedPayload)
        res.status(200).send('Logout processed')
      } catch (error) {
        logger.error(`Invalid logout token ${JSON.stringify(req.body)}:`, error)
        res.status(400).send('Invalid logout token')
      }
    })

    router.get('/sign-in', (req, res, next) => {
      passport.authenticate('oidc', { nonce: generators.nonce() })(req, res, next)
    })

    router.get('/auth/callback', (req, res, next) => {
      passport.authenticate('oidc', {
        nonce: generators.nonce(),
        successRedirect: '/overview',
        failureRedirect: '/autherror',
        failureFlash: true,
      })(req, res, next)
    })

    router.use('/sign-out', async (req, res, next) => {
      if (req.user) {
        const tokenStore = tokenStoreFactory()
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
      } else res.redirect(config.domain)
    })

    router.use(govukOneLogin.authenticationMiddleware())
  })

  return router
}

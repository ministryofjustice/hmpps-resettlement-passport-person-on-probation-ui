// @ts-nocheck
import express, { Router, Request, Response, NextFunction } from 'express'
import path from 'path'
import fs from 'fs'
import * as contentful from 'contentful'
import config from '../config'
import { TokenStore, tokenStoreFactory } from '../data/tokenStore/tokenStore'
import i18n from 'i18n'

let tokenStore: TokenStore

interface Fields {
  internalName?: string
  text?: string
}

interface Item {
  fields?: Fields
}

interface ContentfulResponse {
  items: Item[]
}

const getFileNameForLocale = (locale: string): string => {
  if (locale === 'cy') {
    return '/cy.json'
  }
  return '/en.json'
}

export const fetchPage = async (locale: string, pageId: string) => {
  const { enabled, spaceId, accessToken, previewToken, refreshMinutes } = config.contentful

  const client = contentful.createClient({
    space: spaceId,
    accessToken: accessToken,
    environment: process.env.NODE_ENV === 'production' ? 'master' : 'master',
  })

  try {
    const response = await client.getEntries({ locale, content_type: 'componentDuplex' })
    const contentArray = response.items.map(x => ({
      key: x.fields.internalName,
      value: x.fields.bodyTex.content.flatMap(content => content.content.map(c => c.value)).join(''),
    }))

    console.log('fetchPages has size: ', contentArray.length)
    const targetElement = contentArray.find(element => element.key === pageId)

    return targetElement.value
  } catch (error) {
    console.error(error)
  }
}

const fetchContent = async (locale: string) => {
  const { enabled, spaceId, accessToken, previewToken, refreshMinutes } = config.contentful

  const client = contentful.createClient({
    space: spaceId,
    accessToken: accessToken,
    environment: process.env.NODE_ENV === 'production' ? 'master' : 'master',
  })

  const templatesDir = path.join(__dirname, '../views/locales')
  try {
    const response: ContentfulResponse = await client.getEntries({ locale, content_type: 'componentQuote' })
    const contentArray = response.items.map(x => ({
      [x.fields.internalName]: x.fields.text,
    }))

    // transform contentful data and return
  } catch (error) {
    console.error(error)
  }
}

export const contentfulMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  // Find if contentful was fetched recently
  const contenfulFetched = await tokenStore.getToken('contenfulFetched')
  if (!contenfulFetched) {
    console.log('Contentful fetching now')
    //fetchContent('en-GB')
    const now = new Date()
    tokenStore.setToken('contenfulFetched', now.toISOString(), 10) // 10 seconds for now
  } else {
    console.log('Contentful was fetched at: ', contenfulFetched)
  }
  return next()
}

export function setupContentful(): Router {
  const router = express.Router()
  tokenStore = tokenStoreFactory()
  router.use(contentfulMiddleware)

  return router
}
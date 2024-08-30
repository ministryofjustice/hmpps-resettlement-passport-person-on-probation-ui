import * as contentful from 'contentful'
import { Document } from '@contentful/rich-text-types'
import config from '../config'
import { tokenStoreFactory } from '../data/tokenStore/tokenStore'
import logger from '../../logger'
import { getLocaleForLang } from '../utils/utils'

import {
  FullPageEntry,
  FullPageSkeleton,
  NavigationEntry,
  NavigationSkeleton,
  PersonalisationTag,
  RelatedLinkEntry,
} from './contentfulTypes'
import { convertToHTMLFormat } from './contentfulHtml'

export interface ContentLink {
  text: string
  link: string
}

export interface ContentPage {
  title: string
  order: number
  bodyText: string
  slug: string
  relatedContent: ContentLink[]
  helpAndAdvice: ContentLink[]
  personalisationTags?: PersonalisationTag[]
}

const fallbackPages = [
  {
    order: 1,
    helpAndAdvice: null,
    relatedContent: null,
    slug: 'plan-your-future',
    title: 'Plan your future',
    bodyText: `<a href="/overview" role="button" draggable="false" class="govuk-button govuk-button--start" data-module="govuk-button" data-qa="start-btn">Start</a>`,
  },
] as ContentPage[]

const mapLinks = (relatedLinks: RelatedLinkEntry[]): ContentLink[] => {
  return relatedLinks.map(x => ({
    text: x.fields?.text as string,
    link: x.fields?.link as string,
  }))
}

const getClient = () => {
  const { spaceId, accessToken, previewToken, showPreview, environment } = config.contentful

  if (showPreview) {
    return contentful.createClient({
      space: spaceId,
      accessToken: previewToken,
      host: 'preview.contentful.com',
      environment,
    })
  }
  return contentful.createClient({
    space: spaceId,
    accessToken,
    environment,
  })
}

const mapPage = (entry: FullPageEntry, index: number = 1): ContentPage => {
  const relatedLinks = (entry.fields.relatedContent as RelatedLinkEntry[]) ?? []
  const helpAndAdvice = (entry.fields.helpAndAdvice as RelatedLinkEntry[]) ?? []
  return {
    title: entry.fields.title as string,
    order: index + 1,
    bodyText: convertToHTMLFormat(entry.fields.bodyText as Document),
    slug: entry.fields.slug as string,
    relatedContent: mapLinks(relatedLinks),
    helpAndAdvice: mapLinks(helpAndAdvice),
    personalisationTags: (entry.fields.personalisationTags as PersonalisationTag[]) ?? [],
  }
}

const fetchOrderedPages = async (locale: string): Promise<ContentPage[]> => {
  const client = getClient()
  try {
    const response = await client.getEntries<NavigationSkeleton>({
      locale,
      content_type: 'page',
      'fields.internalName': 'Navigation',
      include: 10,
    })
    if (response.items.length !== 1) {
      logger.error('Error fetching contentful main navigation component: unexpected size retrieved')
    }

    const navigation: NavigationEntry = response.items[0]
    const section = (navigation.fields.section as FullPageEntry[]) ?? []

    return section.map((entry, index) => {
      return mapPage(entry, index)
    })
  } catch (error) {
    logger.error(error)
    return []
  }
}

export const fetchNavigation = async (lang: string): Promise<ContentPage[]> => {
  const locale = getLocaleForLang(lang)

  if (!config.contentful.enabled) {
    return fallbackPages
  }
  const { refreshSeconds, enableCache } = config.contentful
  const tokenStore = tokenStoreFactory()
  const contentfulFetched = enableCache ? await tokenStore.getToken(`contentfulFetched-${lang}`) : null
  if (!contentfulFetched) {
    const content = await fetchOrderedPages(locale.code)
    if (content?.length > 0 && enableCache) {
      await tokenStore.setToken(`contentfulFetched-${lang}`, JSON.stringify(content), refreshSeconds)
    }
    return content
  }
  return JSON.parse(contentfulFetched)
}

export const fetchPageBySlug = async (slug: string, lang: string): Promise<ContentPage> => {
  const locale = getLocaleForLang(lang)
  if (!config.contentful.enabled) {
    return null
  }
  const tokenStore = tokenStoreFactory()
  const { enableCache, refreshSeconds } = config.contentful
  const contentfulFetched = enableCache ? await tokenStore.getToken(`contentfulFetched-${slug}-${lang}`) : null

  if (!contentfulFetched) {
    const client = getClient()
    const content = await client.getEntries<FullPageSkeleton>({
      content_type: 'componentDuplex',
      'fields.slug': slug,
      locale: locale.code,
    })

    if (content?.items?.length === 1) {
      const page = mapPage(content.items[0])
      if (enableCache) {
        await tokenStore.setToken(`contentfulFetched-${slug}-${lang}`, JSON.stringify(page), refreshSeconds)
      }

      return page
    }
    return null
  }

  return JSON.parse(contentfulFetched)
}

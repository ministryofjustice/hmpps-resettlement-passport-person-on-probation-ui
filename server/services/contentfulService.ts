/* eslint-disable @typescript-eslint/no-explicit-any */
import * as contentful from 'contentful'
import { BLOCKS, INLINES, MARKS } from '@contentful/rich-text-types'
import { documentToHtmlString, Options } from '@contentful/rich-text-html-renderer'
import config from '../config'
import { tokenStoreFactory } from '../data/tokenStore/tokenStore'
import logger from '../../logger'
import { getLocaleForLang } from '../utils/utils'

interface Sys {
  id?: string
}
interface Section {
  sys?: Sys
  fields?: Fields
}

interface HtmlContet {
  text: string
}
interface BodyText {
  content: HtmlContet[]
}

interface Fields {
  title?: string
  order?: number
  bodyText?: BodyText
  slug?: string
  section?: Section[]
}

interface Item {
  fields?: Fields
}

interface ContentfulResponse {
  items: Item[]
}

interface RelatedLink {
  fields: {
    text: string
    link: string
  }
}

interface Target {
  fields: {
    icon?: string
    link: string
    qatag: string
    text: string
    lines?: number
  }
}

interface ResponseFields {
  internalName: string
  bodyText: {
    content: {
      content: {
        value: string
      }[]
    }[]
  }
}

export interface OtherLink {
  text: string
  link: string
}

export interface FullPage {
  title: string
  order: number
  bodyText: string
  slug: string
  relatedContent: OtherLink[]
  helpAndAdvice: OtherLink[]
}

const buttonComponent = 'componentHeroBanner'
const navigationComponent = 'page'
const warningComponent = 'warning'
const breakLineComponent = 'breakline'
const pageComponent = 'componentDuplex'

const mapButton = (target: Target) => {
  let icon = ''
  if (target?.fields?.icon) {
    icon = `<svg class="${target?.fields?.icon}" xmlns="http://www.w3.org/2000/svg" width="17.5" height="19" viewBox="0 0 33 40" aria-hidden="true" focusable="false">
          <path fill="currentColor" d="M0 0h13l20 20-20 20H0l20-20z"></path>
        </svg>`
  }
  return `<a href="${target?.fields?.link}" role="button" draggable="false" class="govuk-button govuk-button--start govuk-!-margin-top-4" data-module="govuk-button" data-qa="${target?.fields?.qatag}">
        ${target?.fields?.text}${icon}</a>`
}

const mapWarning = (target: Target) => {
  return `<div class="govuk-warning-text">
  <span class="govuk-warning-text__icon" aria-hidden="true">!</span>
  <strong class="govuk-warning-text__text">
    <span class="govuk-visually-hidden">{{ t('generic-page-warning') }}</span>
    ${target?.fields?.text}
  </strong>
</div>`
}

function appendBr(n: number): string {
  return Array(n).fill('<br>').join('')
}

const mapBreakline = (target: Target) => {
  return appendBr(target?.fields?.lines || 1)
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
] as FullPage[]

const options = {
  renderMark: {
    [MARKS.BOLD]: (text: string) => `<strong>${text}</strong>`,
    [MARKS.ITALIC]: (text: string) => `<em>${text}</em>`,
  },
  renderNode: {
    [INLINES.EMBEDDED_ENTRY]: (node: { content: any; data: any }, next: (arg0: any) => any) => {
      const target = node?.data?.target
      const type = target?.sys?.contentType?.sys?.id
      switch (type) {
        case buttonComponent:
          return mapButton(target)
        case warningComponent:
          return mapWarning(target)
        case breakLineComponent:
          return mapBreakline(target)
        default:
          logger.error('Contentful error could not map embedded entry: ', JSON.stringify(node))
          return ''
      }
    },
    [BLOCKS.HEADING_1]: (node: { content: any }, next: (arg0: any) => any) =>
      `<h1 class="govuk-heading-xl govuk-!-margin-top-6">${next(node.content)}</h1>`,
    [BLOCKS.HEADING_2]: (node: { content: any }, next: (arg0: any) => any) =>
      `<h2 class="govuk-heading-l govuk-!-margin-top-5">${next(node.content)}</h2>`,
    [BLOCKS.HEADING_3]: (node: { content: any }, next: (arg0: any) => any) =>
      `<h3 class="govuk-heading-m govuk-!-margin-top-4">${next(node.content)}</h3>`,
    [BLOCKS.HEADING_4]: (node: { content: any }, next: (arg0: any) => any) =>
      `<h4 class="govuk-heading-s govuk-!-margin-top-3">${next(node.content)}</h4>`,
    [BLOCKS.UL_LIST]: (node: { content: any }, next: (arg0: any) => any) =>
      `<ul class="govuk-body-m govuk-!-margin-top-4">${next(node.content)}</ul>`,
    [BLOCKS.OL_LIST]: (node: { content: any }, next: (arg0: any) => any) =>
      `<ol class="govuk-body-m govuk-!-margin-top-4">${next(node.content)}</ol>`,
    [BLOCKS.PARAGRAPH]: (node: { content: any }, next: (arg0: any) => any) =>
      `<p class="govuk-body-m">${next(node.content)}</p>`,
    [BLOCKS.QUOTE]: (node: { content: any }, next: (arg0: any) => any) =>
      `<div class="govuk-inset-text">${next(node.content)}</div>`,
    [BLOCKS.TABLE]: (node: { content: any }, next: (arg0: any) => any) =>
      `<table class="govuk-table govuk-!-margin-top-4">${next(node.content)}</table>`,
    [BLOCKS.TABLE_HEADER_CELL]: (node: { content: any }, next: (arg0: any) => any) =>
      `<th class="govuk-table__header">${next(node.content)}</th>`,
    [BLOCKS.TABLE_ROW]: (node: { content: any }, next: (arg0: any) => any) =>
      `<tr class="govuk-table__row">${next(node.content)}</tr>`,
    [BLOCKS.TABLE_CELL]: (node: { content: any }, next: (arg0: any) => any) =>
      `<td class="govuk-table__cell">${next(node.content)}</td>`,
    [BLOCKS.EMBEDDED_ASSET]: ({
      data: {
        target: { fields },
      },
    }) =>
      `<figure class="govuk-!-margin-top-6 govuk-!-margin-bottom-6"><img src="https:${fields.file.url}" alt="${fields.description}" /></figure>`,
    [INLINES.HYPERLINK]: (node, next) => `<a class="govuk-link" href="${node.data.uri}">${next(node.content)}</a>`,
  },
} as Partial<Options>

const convertToHTMLFormat = (body: any) => documentToHtmlString(body, options)

export const fetchPage = async (locale: string, pageId: string) => {
  const client = getClient()

  try {
    const response = await client.getEntries({ locale, content_type: pageComponent })
    const contentArray = response.items.map(x => {
      const fields = x.fields as unknown as ResponseFields
      return {
        key: fields.internalName,
        value: fields.bodyText.content.flatMap(content => content.content.map(c => c.value)).join(''),
      }
    })

    const targetElement = contentArray.find(element => element.key === pageId)

    return targetElement.value
  } catch (error) {
    logger.error(error)
    return null
  }
}

const mapLinks = (relatedLinks: RelatedLink[]) => {
  return relatedLinks?.map(x => ({
    text: x.fields?.text,
    link: x.fields?.link,
  }))
}

const getClient = () => {
  const { spaceId, accessToken, previewToken, showPreview } = config.contentful

  if (showPreview === 'true') {
    return contentful.createClient({
      space: spaceId,
      accessToken: previewToken,
      host: 'preview.contentful.com',
    })
  }
  return contentful.createClient({
    space: spaceId,
    accessToken,
  })
}

const mapPage = (x: contentful.Entry<contentful.EntrySkeletonType, undefined, string>, index: number = 1): FullPage => {
  return {
    title: x.fields.title as string,
    order: index + 1,
    bodyText: convertToHTMLFormat(x.fields.bodyText),
    slug: x.fields.slug as string,
    relatedContent: mapLinks(x.fields.relatedContent as unknown as RelatedLink[]),
    helpAndAdvice: mapLinks(x.fields.helpAndAdvice as unknown as RelatedLink[]),
  }
}

const fetchPageById = async (
  id: string,
  client: contentful.ContentfulClientApi<undefined>,
  index: number,
  locale: string,
) => {
  const x = await client.getEntry(id, { locale })
  return mapPage(x, index)
}

const fetchOrderedPages = async (locale: string): Promise<FullPage[]> => {
  const client = getClient()
  try {
    const response: ContentfulResponse = await client.getEntries({
      locale,
      content_type: navigationComponent,
    })
    if (response.items.length !== 1) {
      logger.error('Error fetching contentful main navigation component: unexpected size retrieved')
    }

    const pages = await Promise.all(
      response.items[0].fields?.section?.map(async (page, index) => fetchPageById(page.sys.id, client, index, locale)),
    )

    return pages as FullPage[]
  } catch (error) {
    logger.error(error)
    return []
  }
}

export const fetchNavigation = async (lang: string): Promise<FullPage[]> => {
  const locale = getLocaleForLang(lang)

  if (config.contentful.enabled === 'false') {
    return fallbackPages
  }
  const tokenStore = tokenStoreFactory()
  const contenfulFetched = await tokenStore.getToken(`contenfulFetched-${lang}`)
  if (!contenfulFetched) {
    const content = await fetchOrderedPages(locale.code)
    if (content?.length > 0) {
      const { refreshSeconds } = config.contentful
      await tokenStore.setToken(`contenfulFetched-${lang}`, JSON.stringify(content), refreshSeconds)
    }
    return content
  }
  return JSON.parse(contenfulFetched)
}

export const fetchPageBySlug = async (slug: string, lang: string): Promise<FullPage> => {
  const locale = getLocaleForLang(lang)
  if (config.contentful.enabled === 'false') {
    return null
  }
  const tokenStore = tokenStoreFactory()
  const contenfulFetched = await tokenStore.getToken(`contenfulFetched-${slug}-${lang}`)
  if (!contenfulFetched) {
    const client = getClient()
    const content = await client.getEntries({
      content_type: pageComponent,
      'fields.slug[in]': slug,
      locale: locale.code,
    })

    if (content?.items?.length === 1) {
      const { refreshSeconds } = config.contentful
      const page = mapPage(content.items[0])
      await tokenStore.setToken(`contenfulFetched-${slug}-${lang}`, JSON.stringify(page), refreshSeconds)
      return page
    }
    return null
  }

  return JSON.parse(contenfulFetched)
}

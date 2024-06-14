// @ts-nocheck
import * as contentful from 'contentful'
import config from '../config'
import { tokenStoreFactory } from '../data/tokenStore/tokenStore'
import { BLOCKS, INLINES, MARKS } from '@contentful/rich-text-types'
import { documentToHtmlString, Options } from '@contentful/rich-text-html-renderer'

interface Fields {
  title?: string
  order?: number
  bodyText?: string
  slug?: string
}

interface Item {
  fields?: Fields
}

interface ContentfulResponse {
  items: Item[]
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

const options = {
  renderMark: {
    [MARKS.BOLD]: (text: string) => `<strong>${text}</strong>`,
    [MARKS.ITALIC]: (text: string) => `<em>${text}</em>`,
  },
  renderNode: {
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

const mapLinks = relatedLinks => {
  return relatedLinks.map(x => ({
    text: x.fields.text,
    link: x.fields.link,
  }))
}

const fetchContent = async (locale: string): FullPage[] => {
  const { enabled, spaceId, accessToken, previewToken, refreshMinutes } = config.contentful

  const client = contentful.createClient({
    space: spaceId,
    accessToken: accessToken,
    environment: 'master',
  })

  try {
    const response: ContentfulResponse = await client.getEntries({ locale, content_type: 'componentDuplex' })
    const contentArray = response.items.map(x => ({
      title: x.fields.title,
      order: x.fields.order,
      bodyText: convertToHTMLFormat(x.fields.bodyText),
      slug: x.fields.slug,
      relatedContent: mapLinks(x.fields.relatedContent),
      helpAndAdvice: mapLinks(x.fields.helpAndAdvice),
    }))
    return contentArray
  } catch (error) {
    console.error(error)
  }
}

export const handleContent = async (): FullPage[] => {
  // Find if contentful was fetched recently
  const tokenStore = tokenStoreFactory()
  const contenfulFetched = await tokenStore.getToken('contenfulFetched')
  if (!contenfulFetched) {
    console.log('Contentful fetching now')
    const content = fetchContent('en-GB')
    if (content?.length > 0) {
      const now = new Date()
      await tokenStore.setToken('contenfulFetched', now.toISOString(), 10) // 10 seconds for now
    }
    return content
  }
  console.log('Contentful was cached at: ', contenfulFetched)
  return contenfulFetched
}

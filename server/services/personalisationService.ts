import { fetchNavigation } from './contentfulService'
import { PersonalisationTag } from './contentfulTypes'

export type ContentPageLink = {
  slug: string
  title: string
}

export type ContentPageLinks = {
  personalLinks: ContentPageLink[]
  otherLinks: ContentPageLink[]
}

export type ContentWithTags = ContentPageLink & { tags: PersonalisationTag[] }

export async function findPersonalisedContent(tags: string[], lang: string): Promise<ContentPageLinks> {
  const contentPages = await fetchNavigation(lang)
  const mappedTags = mapProfileTagsToContentfulTags(tags)
  const allContent = contentPages.map(page => {
    return {
      slug: page.slug,
      title: page.title,
      tags: page.personalisationTags ?? [],
    }
  })
  return {
    personalLinks: getPersonalLinks(mappedTags, allContent),
    otherLinks: getOtherLinks(mappedTags, allContent),
  }
}

export function getPersonalLinks(tags: Set<string>, content: ContentWithTags[]): ContentPageLink[] {
  return content.filter(l => l.tags.some(tag => tags.has(tag)))
}

export function getOtherLinks(tags: Set<string>, content: ContentWithTags[]): ContentPageLink[] {
  return content.filter(l => !l.tags.some(tag => tags.has(tag)))
}

export function mapProfileTagsToContentfulTags(tags: string[]): Set<string> {
  const result = new Set<string>()
  for (const tag of tags) {
    const contentfulTag = tag.toLowerCase()?.replaceAll('_', '-')
    if (contentfulTag) {
      result.add(contentfulTag)
    }
  }
  return result
}

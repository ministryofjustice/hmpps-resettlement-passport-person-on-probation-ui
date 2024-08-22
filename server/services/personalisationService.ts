import { fetchNavigation } from './contentfulService'
import { PersonalisationTag } from './contentfulTypes'

export type ContentLink = {
  slug: string
  title: string
}

export type ContentLinks = {
  personalLinks: ContentLink[]
  otherLinks: ContentLink[]
}

export type ContentWithTags = ContentLink & { tags: PersonalisationTag[] }

export async function findPersonalisedContent(tags: string[], lang: string): Promise<ContentLinks> {
  const contentPages = await fetchNavigation(lang)
  const mappedTags = mapProfileTagsToContentfulTags(tags)
  const allContent = contentPages.map(page => {
    return {
      slug: page.slug,
      title: page.title,
      tags: page.personalisationTags,
    }
  })
  console.log(mappedTags, JSON.stringify(allContent, null, 2))
  return {
    personalLinks: getPersonalLinks(mappedTags, allContent),
    otherLinks: getOtherLinks(mappedTags, allContent),
  }
}

export function getPersonalLinks(tags: Set<string>, content: ContentWithTags[]): ContentLink[] {
  return content.filter(l => l.tags.some(tag => tags.has(tag)))
}

export function getOtherLinks(tags: Set<string>, content: ContentWithTags[]): ContentLink[] {
  return content.filter(l => !l.tags.some(tag => tags.has(tag)))
}

const profileTagsToContentTags: Record<string, string> = {
  NO_FIXED_ABODE: 'no-fixed-abode',
  HOME_ADAPTION_POST_RELEASE: 'home-adaption-post-release',
  ARRANGE_STORAGE_FOR_PERSONAL: '',
  MANAGE_EMOTIONS: '',
  GAMBLING_ISSUE: 'gambling-issue',
  MEET_CHILDREN: 'meet-children',
  COMMUNITY_ORG_SUPPORT: 'community-org-support',
  DRUG_ISSUE: 'drug-issue',
  ALCOHOL_ISSUE: 'alcohol-issue',
  FIND_A_JOB: 'find-a-job',
  CONTACT_EMPLOYER: 'contact-employer',
  FIND_EDUCATION_TRAINING: 'find-education-training',
  CONTACT_EDUCATION_TRAINING: 'contact-education-training',
  BURSARIES_AND_GRANTS_TRAINING: 'bursaries-and-grants',
  MANAGE_DEBT_ARREARS: 'manage-debt-arrears',
  HELP_TO_CONTACT_BANK: 'help-to-contact-bank',
  REGISTERING_GP_SURGERY: 'registering-gp',
  CARE_HEALTH_SUPPORT: 'care-health-support',
}

export function mapProfileTagsToContentfulTags(tags: string[]): Set<string> {
  const result = new Set<string>()
  for (const tag of tags) {
    const mapped = profileTagsToContentTags[tag]
    if (mapped) {
      result.add(mapped)
    }
  }
  return result
}

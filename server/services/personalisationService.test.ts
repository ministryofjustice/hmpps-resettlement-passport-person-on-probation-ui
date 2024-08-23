import { ContentPageLink, ContentWithTags, getOtherLinks, getPersonalLinks } from './personalisationService'

const content: ContentWithTags[] = [
  {
    slug: 'accommodation',
    title: 'Accommodation',
    tags: ['no-fixed-abode', 'home-adaption-post-release'],
  },
  {
    slug: 'finance-id-benefits-and-debt',
    title: 'Banking, ID and pensions',
    tags: ['help-to-contact-bank'],
  },
  {
    slug: 'benefits-and-debt',
    title: 'Benefits and debt',
    tags: [],
  },
]

describe('should filter links into personal and other', () => {
  test('no-fixed-abode', () => {
    const tags = new Set(['no-fixed-abode'])
    expect(slugsOf(getPersonalLinks(tags, content))).toEqual(['accommodation'])
    expect(slugsOf(getOtherLinks(tags, content))).toEqual(['finance-id-benefits-and-debt', 'benefits-and-debt'])
  })
})

function slugsOf(content: ContentPageLink[]) {
  return content.map(c => c.slug)
}

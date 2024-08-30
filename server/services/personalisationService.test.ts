import {
  ContentPageLink,
  ContentWithTags,
  getOtherLinks,
  getPersonalLinks,
  mapProfileTagsToContentfulTags,
} from './personalisationService'

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

describe('should map api tags to contentful tags', () => {
  test.each([
    ['NO_FIXED_ABODE', 'no-fixed-abode'],
    ['HOME_ADAPTION_POST_RELEASE', 'home-adaption-post-release'],
    ['KEEP_THEIR_HOME', 'keep-their-home'],
    ['CANCEL_TENANCY', 'cancel-tenancy'],
    ['PAYMENT_FOR_RENT_ARREARS', 'payment-for-rent-arrears'],
    ['ARRANGE_STORAGE_FOR_PERSONAL', 'arrange-storage-for-personal'],
    ['MANAGE_EMOTIONS', 'manage-emotions'],
    ['GAMBLING_ISSUE', 'gambling-issue'],
    ['MEET_CHILDREN', 'meet-children'],
    ['COMMUNITY_ORG_SUPPORT', 'community-org-support'],
    ['MENTORING_SUPPORT', 'mentoring-support'],
    ['DRUG_ISSUE', 'drug-issue'],
    ['ALCOHOL_ISSUE', 'alcohol-issue'],
    ['FIND_A_JOB', 'find-a-job'],
    ['CONTACT_EMPLOYER', 'contact-employer'],
    ['FIND_EDUCATION_TRAINING', 'find-education-training'],
    ['CONTACT_EDUCATION_TRAINING', 'contact-education-training'],
    ['BURSARIES_AND_GRANTS_TRAINING', 'bursaries-and-grants-training'],
    ['NO_BANK_ACCOUNT', 'no-bank-account'],
    ['MANAGE_ID_DOCUMENTS', 'manage-id-documents'],
    ['MANAGE_DEBT_ARREARS', 'manage-debt-arrears'],
    ['HELP_TO_CONTACT_BANK', 'help-to-contact-bank'],
    ['REGISTERING_GP_SURGERY', 'registering-gp-surgery'],
    ['CARE_HEALTH_SUPPORT', 'care-health-support'],
  ])('Api tag %s becomes %s', (i, e) => {
    expect(mapProfileTagsToContentfulTags([i])).toEqual(new Set([e]))
  })
})

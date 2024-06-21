import * as contentful from 'contentful'
import { fetchNavigation } from './contentfulService'
import { mockedPage, mockedResponse } from '../testutils/mockedContentfulResponse'

jest.mock('contentful')

describe('AppointmentService', () => {
  let contentfulMock: jest.Mocked<contentful.ContentfulClientApi<undefined>>

  beforeEach(() => {
    contentfulMock = {
      getEntries: jest.fn().mockResolvedValue(mockedResponse),
      getEntry: jest.fn().mockResolvedValue(mockedPage),
    } as unknown as jest.Mocked<contentful.ContentfulClientApi<undefined>>

    jest.mocked(contentful.createClient).mockReturnValue(contentfulMock)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  const cleanText = (s: string) => s.replace(/[\t\n]/g, '').replace(/\s+/g, '')

  it('should fetch contentful content as ordered Pages', async () => {
    const expectedHtml = `<p class="govuk-body-m">This is a secure and confidential service for people on probation in England and Wales after leaving prison.</p><p class="govuk-body-m">Use this service to:</p><ul class="govuk-body-m govuk-!-margin-top-4"><li><p class="govuk-body-m">view your licence conditions</p></li><li><p class="govuk-body-m">check your upcoming meetings and appointments</p></li></ul><p class="govuk-body-m"><a href="/overview" role="button" draggable="false" class="govuk-button govuk-button--start govuk-!-margin-top-4" data-module="govuk-button" data-qa="start-btn">
    Sign in<svg class="govuk-button__start-icon" xmlns="http://www.w3.org/2000/svg" width="17.5" height="19" viewBox="0 0 33 40" aria-hidden="true" focusable="false">
    <path fill="currentColor" d="M0 0h13l20 20-20 20H0l20-20z"></path>
      </svg></a></p><h2 class="govuk-heading-l govuk-!-margin-top-5">Before you start</h2><p class="govuk-body-m">This service uses GOV.UK One Login. You’ll be able to create a GOV.UK One Login if you do not already have one.</p><p class="govuk-body-m">You&#39;ll need a mobile phone to receive security codes.</p><p class="govuk-body-m">For your privacy and security you will be signed out automatically after 60 minutes.</p><h3 class="govuk-heading-m govuk-!-margin-top-4">First time users</h3><p class="govuk-body-m">You&#39;ll enter the First-time ID code from page 1 in the black pack you were given when you left prison.</p><p class="govuk-body-m">If you do not have a First-time ID code, or it has expired, your probation officer can provide a new one.</p><p class="govuk-body-m"><strong></strong><div class="govuk-warning-text">
      <span class="govuk-warning-text__icon" aria-hidden="true">!</span>
      <strong class="govuk-warning-text__text">
    <span class="govuk-visually-hidden">{{ t('generic-page-warning') }}</span>
    Only use this service if your licence conditions allow you to use the internet.
    </strong>
    </div></p><p class="govuk-body-m">
      </p>`
    const response = await fetchNavigation('en')
    const firstItem = response[0]
    expect(firstItem.title).toEqual('Page1')
    expect(firstItem.slug).toEqual('page1')
    expect(firstItem.order).toEqual(1)
    expect(cleanText(firstItem.bodyText)).toEqual(cleanText(expectedHtml))
  })
})

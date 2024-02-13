import Page, { PageElement } from './page'

export default class IndexPage extends Page {
  constructor() {
    super('Create a GOV.UK One Login or sign in')
  }

  headerUserName = (): PageElement => cy.get('[data-qa=header-user-name]')

  headerPhaseBanner = (): PageElement => cy.get('[data-qa=header-phase-banner]')
}

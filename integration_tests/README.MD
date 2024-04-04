# Integration tests

## Mocking Api
Any mockApi under this directory, will need to be added to `cypress.config.ts`
Also ensure feature.env is updated with any environment variable required for int-testing
Use mocks in your test file with `cy.task()` for example `cy.task('stubSignIn')`

## Page object models
Although they may not seem very useful, the page object models extends the `Page` class which by default runs accessibility checks (axe-core),
so it is important to make sure we have a page object for every page to catch any accessibility violation.
Any mockApi under this directory, will need to be added to `cypress.config.ts`

Also ensure feature.env is updated with any environment variable required for int-testing

Use mocks in your test file with `cy.task()` for example `cy.task('stubSignIn')`
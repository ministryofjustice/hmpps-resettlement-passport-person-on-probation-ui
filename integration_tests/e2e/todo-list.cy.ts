import Page, { TodoListAddPage, TodoListEditPage, TodoListPage } from '../pages/page'
import 'cypress-map'
import { FeatureFlagKey } from '../../server/services/featureFlags'
import OverviewPage from '../pages/overview'

context('To-do list', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubForDefaultLoggedInUser')
  })

  it('can view todo list', () => {
    cy.task('stubGetTodoTasks')
    cy.signIn()
    cy.visit('/todo')

    Page.verifyOnPage(TodoListPage).runAxe()

    cy.get('#todo-list-table tbody')
      .table()
      .should(table => {
        expect(table).to.have.length(2)
        const [row1, row2] = table

        expect(row1).to.be.eql(['', 'Make tea', '', '1 sugar', 'Edit'])
        expect(row2).to.be.eql(['', 'Write CV', '30 Oct 2026', '', 'Edit'])
      })

    cy.get('details').should('not.have.attr', 'open')
    cy.get('summary').should('contain.text', 'Completed tasks').click()
    cy.get('details').should('have.attr', 'open')

    cy.get('#completed-table tbody')
      .table()
      .should(table => {
        expect(table).to.have.length(1)
        expect(table[0]).to.be.eql(['Make toast', '2 Oct 2024', ''])
      })
  })

  it('There should be links to actions', () => {
    cy.task('stubGetTodoTasks')
    cy.signIn()
    cy.visit('/todo')

    Page.verifyOnPage(TodoListPage)

    cy.get('#todo-list-table tbody a')
      .eq(0)
      .should('have.text', 'Edit')
      .should('have.attr', 'href', '/todo/item/81fce0af-845e-4753-871b-3809d04c888a/edit')

    cy.get('#todo-list-table tbody a')
      .eq(1)
      .should('have.text', 'Edit')
      .should('have.attr', 'href', '/todo/item/848de9ca-773c-44b3-8152-333299ad79b3/edit')

    cy.get('#add-new-button').should('have.text', 'Add a new item').should('have.attr', 'href', '/todo/add')
  })

  it('can complete an item', () => {
    cy.task('stubGetTodoTasks')
    cy.task('stubPatchTodoTask')
    cy.signIn()
    cy.visit('/todo')

    cy.get('#task-81fce0af-845e-4753-871b-3809d04c888a').click({ force: true })

    cy.get('#todo-list-table tbody tr').eq(0).should('be.hidden')
    cy.get('#completed-table tbody').table().should('have.length', 2)
  })
})

context('Add to todo-list', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubForDefaultLoggedInUser')
  })

  it('can add an item to list', () => {
    cy.signIn()
    cy.task('stubPostNewTask')
    cy.visit('/todo/add')

    Page.verifyOnPage(TodoListAddPage).runAxe()

    cy.get('#title').type('Fish for trout')
    cy.get('#notes').type('Use bait')
    cy.get('#submit-button').click()

    // Should be back on list page after add
    Page.verifyOnPage(TodoListPage)
  })

  it('validates the item', () => {
    cy.signIn()
    cy.visit('/todo/add')

    Page.verifyOnPage(TodoListAddPage)

    cy.get('.govuk-button').click()

    cy.get('.govuk-error-summary').should('include.text', 'Enter a title')
    cy.get('#title-error').should('contain.text', 'Enter a title')
  })
})

context('Edit a todo-list item', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubForDefaultLoggedInUser')
  })

  it('can add an item to list', () => {
    cy.signIn()
    cy.task('stubGetOneTask')
    cy.task('stubPutTask')
    cy.visit('/todo/item/9951967c-f7e0-4f54-945a-aa0abe376536/edit')

    Page.verifyOnPage(TodoListEditPage).runAxe()

    cy.get('#title').should('have.value', 'Fish for trout')
    cy.get('#notes').should('have.value', 'Use bait')
    cy.get('#due-date-day').type('1')
    cy.get('#due-date-month').type('1')
    cy.get('#due-date-year').type('2025')
    cy.get('#submit-button').click()

    // Should be back on list page after submit
    Page.verifyOnPage(TodoListPage)
  })

  it('validates the item', () => {
    cy.signIn()
    cy.task('stubGetOneTask')
    cy.visit('/todo/item/9951967c-f7e0-4f54-945a-aa0abe376536/edit')

    Page.verifyOnPage(TodoListEditPage)

    cy.get('#due-date-day').type('1')
    cy.get('#submit-button').click()

    cy.get('.govuk-error-summary').should('include.text', 'Due date must be a real date')
    cy.get('#due-date-error').should('contain.text', 'Due date must be a real date')
  })

  it('deletes the item', () => {
    cy.signIn()
    cy.task('stubGetOneTask')
    cy.task('stubDeleteTask')
    cy.visit('/todo/item/9951967c-f7e0-4f54-945a-aa0abe376536/edit')

    Page.verifyOnPage(TodoListEditPage)

    cy.get('#delete-button').click()
    // Should be back on list page after delete
    Page.verifyOnPage(TodoListPage)
  })
})

context('Todo feature flag', () => {
  before(() => {
    cy.task('reset')
    cy.task('stubForDefaultLoggedInUser')
    cy.task('disableFlag', FeatureFlagKey.TODO_LIST)
  })
  ;['/todo', '/todo/add', '/todo/item/id/edit'].forEach(page =>
    it(`Should redirect to overview from ${page} when flag is disabled`, () => {
      cy.signIn()
      cy.visit(page)
      Page.verifyOnPage(OverviewPage)
    }),
  )

  after(() => {
    cy.task('restoreFlags')
  })
})

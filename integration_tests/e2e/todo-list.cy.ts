import Page, { TodoListAddPage, TodoListEditPage, TodoListPage } from '../pages/page'
import 'cypress-map'
import { FeatureFlagKey } from '../../server/services/featureFlags'
import OverviewPage from '../pages/overview'

const teaTask = {
  id: '81fce0af-845e-4753-871b-3809d04c888a',
  prisonerId: 1,
  title: 'Make tea',
  notes: '1 sugar',
  dueDate: null,
  completed: false,
  createdByUrn: 'urn:fdc:gov.uk:2022:user1',
  updatedByUrn: 'urn:fdc:gov.uk:2022:user1',
  creationDate: '2024-10-02T15:38:15.979258',
  updatedAt: '2024-10-02T15:38:15.979269',
}
const toastTask = {
  id: '634eacc9-86da-4c9c-963b-3d24359ca38b',
  prisonerId: 1,
  title: 'Make toast',
  notes: '',
  dueDate: null,
  completed: false,
  createdByUrn: 'urn:fdc:gov.uk:2022:user1',
  updatedByUrn: 'urn:fdc:gov.uk:2022:user1',
  creationDate: '2024-10-02T15:39:16.118321',
  updatedAt: '2024-10-02T15:39:20.106478',
}

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

        expect(row1).to.be.eql(['', 'Make tea', '', '1 sugar', 'Update'])
        expect(row2).to.be.eql(['', 'Write CV', '30 Oct 2026', '', 'Update'])
      })

    cy.get('details').should('not.have.attr', 'open')
    cy.get('summary').should('contain.text', 'Completed tasks').click()
    cy.get('details').should('have.attr', 'open')

    cy.get('#completed-table tbody')
      .table()
      .should(table => {
        expect(table).to.have.length(1)
        expect(table[0]).to.be.eql(['', 'Make toast', '2 Oct 2024', ''])
      })
  })

  it('There should be links to actions', () => {
    cy.task('stubGetTodoTasks')
    cy.signIn()
    cy.visit('/todo')

    Page.verifyOnPage(TodoListPage)

    cy.get('#todo-list-table tbody a')
      .eq(0)
      .should('have.text', 'Update')
      .should('have.attr', 'href', '/todo/item/81fce0af-845e-4753-871b-3809d04c888a/edit')

    cy.get('#todo-list-table tbody a')
      .eq(1)
      .should('have.text', 'Update')
      .should('have.attr', 'href', '/todo/item/848de9ca-773c-44b3-8152-333299ad79b3/edit')

    cy.get('#add-new-button').should('have.text', 'Add a new item').should('have.attr', 'href', '/todo/add')
  })

  it('can complete an item', () => {
    cy.task('stubGetTodoTasks', { tasks: [teaTask, toastTask] })
    cy.task('stubPatchTodoTask')
    cy.signIn()
    cy.visit('/todo')

    cy.get('summary').should('contain.text', 'Completed tasks').click()

    cy.get('#todo-list-table tbody').table().should('have.length', 2)
    cy.get('#completed-table tbody').table().should('have.length', 0)

    cy.task('stubGetTodoTasks', { tasks: [{ ...teaTask, completed: true }, toastTask] })
    cy.intercept('/todo/item/81fce0af-845e-4753-871b-3809d04c888a/complete').as('complete')

    cy.get('#task-81fce0af-845e-4753-871b-3809d04c888a').parent().click()

    cy.wait('@complete')
    cy.get('#todo-list-table tbody')
      .table()
      .should('have.length', 1)
      .its(0)
      .should('eql', ['', 'Make toast', '', '', 'Update'])

    cy.get('#completed-table tbody')
      .table()
      .should('have.length', 1)
      .its(0)
      .should('eql', ['', 'Make tea', '2 Oct 2024', '1 sugar'])
  })

  it('can mark an item not completed an item', () => {
    cy.task('stubGetTodoTasks', { tasks: [{ ...teaTask, completed: true }, toastTask] })
    cy.task('stubPatchTodoTask')
    cy.signIn()
    cy.visit('/todo')

    cy.get('summary').should('contain.text', 'Completed tasks').click()

    cy.get('#todo-list-table tbody').table().should('have.length', 1)
    cy.get('#completed-table tbody').table().should('have.length', 1)

    cy.task('stubGetTodoTasks', { tasks: [teaTask, toastTask] })
    cy.intercept('/todo/item/81fce0af-845e-4753-871b-3809d04c888a/not-completed').as('not-completed')

    cy.get('#task-81fce0af-845e-4753-871b-3809d04c888a').parent().click()

    cy.wait('@not-completed')
    cy.get('#completed-table tbody').table().should('have.length', 0)
    cy.get('#todo-list-table tbody').table().should('have.length', 2)
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

  it('can edit an item in the list', () => {
    cy.signIn()
    cy.task('stubGetOneTask')
    cy.task('stubPutTask')
    cy.visit('/todo/item/9951967c-f7e0-4f54-945a-aa0abe376536/edit')

    Page.verifyOnPage(TodoListEditPage).runAxe()

    cy.get('#title').should('have.value', 'Fish for trout')
    cy.get('#notes').should('have.value', 'Use bait')
    cy.get('#due-date-day').type('1')
    cy.get('#due-date-month').type('1')
    cy.get('#due-date-year').type('2030')
    cy.get('#submit-button').click()

    // Should be back on list page after submit
    Page.verifyOnPage(TodoListPage)
  })

  it('validates the item', () => {
    cy.signIn()
    cy.task('stubGetOneTask')
    cy.visit('/todo/item/9951967c-f7e0-4f54-945a-aa0abe376536/edit')

    Page.verifyOnPage(TodoListEditPage)

    cy.get('#due-date-day').type('32')
    cy.get('#due-date-month').type('13')
    cy.get('#due-date-year').type('2087')
    cy.get('#submit-button').click()

    cy.get('.govuk-error-summary').should('include.text', 'Due date must be a real date')
    cy.get('#due-date-error').should('contain.text', 'Due date must be a real date')
  })
  it('validates the year length', () => {
    cy.signIn()
    cy.task('stubGetOneTask')
    cy.visit('/todo/item/9951967c-f7e0-4f54-945a-aa0abe376536/edit')

    Page.verifyOnPage(TodoListEditPage)

    cy.get('#due-date-day').type('31')
    cy.get('#due-date-month').type('12')
    cy.get('#due-date-year').type('20879')
    cy.get('#submit-button').click()

    cy.get('.govuk-error-summary').should('include.text', 'Due date must include a year with 4 numbers')
    cy.get('#due-date-error').should('contain.text', 'Due date must include a year with 4 numbers')
  })
  it('validates only day given', () => {
    cy.signIn()
    cy.task('stubGetOneTask')
    cy.visit('/todo/item/9951967c-f7e0-4f54-945a-aa0abe376536/edit')
    Page.verifyOnPage(TodoListEditPage)
    cy.get('#due-date-day').type('31')
    cy.get('#submit-button').click()

    cy.get('.govuk-error-summary').should('include.text', 'Due date must include a month and year')
    cy.get('#due-date-error').should('contain.text', 'Due date must include a month and year')
  })
  it('validates only year given', () => {
    cy.signIn()
    cy.task('stubGetOneTask')
    cy.visit('/todo/item/9951967c-f7e0-4f54-945a-aa0abe376536/edit')

    Page.verifyOnPage(TodoListEditPage)
    cy.get('#due-date-day').clear()
    cy.get('#due-date-month').clear()
    cy.get('#due-date-year').type('2029')
    cy.get('#submit-button').click()

    cy.get('.govuk-error-summary').should('include.text', 'Due date must include a day and month')
    cy.get('#due-date-error').should('contain.text', 'Due date must include a day and month')
  })
  it('validates only month given', () => {
    cy.signIn()
    cy.task('stubGetOneTask')
    cy.visit('/todo/item/9951967c-f7e0-4f54-945a-aa0abe376536/edit')

    Page.verifyOnPage(TodoListEditPage)
    cy.get('#due-date-day').clear()
    cy.get('#due-date-month').type('12')
    cy.get('#due-date-year').clear()
    cy.get('#submit-button').click()

    cy.get('.govuk-error-summary').should('include.text', 'Due date must include a day and year')
    cy.get('#due-date-error').should('contain.text', 'Due date must include a day and year')
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

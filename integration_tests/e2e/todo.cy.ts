import Page, { TodoListPage } from '../pages/page'
import 'cypress-map'

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
})

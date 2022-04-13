/// <reference types="Cypress" />
const { faker } = require('@faker-js/faker')

const boardName = faker.word.noun()

describe('board creation', () => {

  beforeEach(() => {
    cy.request({
      method: 'POST',
      url: '/api/reset'
    })

  })

  it('creates a board', () => {
    cy
      .intercept({
        method: 'POST',
        url: '/api/boards'
      }).as('createBoard')

    cy
      .visit('/')

    cy
      .get('[data-cy=create-board]')
      .click()
    cy
      .get('[data-cy=new-board-input]')
      .type(`${boardName}`)
    cy
      .get('[data-cy="new-board-create"]').click()

    cy
      .wait('@createBoard')
      .then((board) => {
        expect(board.response.statusCode).to.eq(201)
        expect(board.request.body.name).to.eq(boardName)
      })
  })

  it('redirects to the board after creation', () => {

    cy
      .visit('/')

    cy
      .get('[data-cy=create-board]')
      .click()
    cy
      .get('[data-cy=new-board-input]')
      .type(`${boardName}{enter}`)

    cy
      .url()
      .should('include', Cypress.config().baseUrl + '/board/')
    cy
      .get('[data-cy=board-title]')
      .should('have.value', `${boardName}`)
  })

  it('displays an error when there is a problem creating a board', () => {
    cy
      .intercept({
        method: 'POST',
        url: '/api/boards'
      }, {
        forceNetworkError: true
      }).as('createBoard')

    cy.visit('/')

    cy
      .get('[data-cy=create-board]')
      .click()
    cy
      .get('[data-cy=new-board-input]')
      .type(`${boardName}{enter}`)

    cy
      .get('#errorMessage')
      .should('be.visible')

  })

})

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

describe('starred boards', () => {
  // beforeEach(() => {
  //   cy
  //     .intercept({
  //       method: 'GET',
  //       url: '/api/boards'
  //     }, {
  //       fixture: 'someBoards.json'
  //     }).as('boardList')
  // })

  it.only('can star a board', () => {
    cy
      .intercept({
        method: 'GET',
        url: '/api/boards'
      }, {
        fixture: 'someBoards.json'
      }).as('boardList')

    cy
      .visit('/')

    cy.wait('@boardList').then((result) => {
      console.log(result.response.body)
      expect(result.response.body[0]).to.have.property('')
    })

    // cy.wait('@boardList')

    // cy
    //   .get('[data-cy=star]')
    //   .first()
    //   .invoke('show')
    //   .click()

    // cy.wait('@boardList').then((result) => {
    //   cy
    //     .get('[data-cy=star]')
    //     .first()
    //     .invoke('show')
    //     .click()

    //   //expect(result.response.body['starred']).to.be.true
    // }
    // )

    // cy.wait('@boardList').then((board) => {
    //   board
    //     .get('[data-cy=star]')
    //     .first()
    //     .invoke('show')
    //     .click()

    //cy.get('@boardList')

    //expect(board.response.body).to.exist
    //})

  })

  it('adds a board to My Starred section', () => {
    cy
      .visit('/')

    cy
      .get

  })

  it('remains in My Boards when a board is also starred', () => {

  })

  it('can be removed from My Starred section', () => {

  })

})

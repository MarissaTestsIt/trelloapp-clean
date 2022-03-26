/// <reference types="Cypress" />

describe('my first test', () => {
  it('should load the base URL', () => {
    cy
      .visit('/');
  });
});

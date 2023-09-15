describe('Descope', function () {
  beforeEach(function () {
    cy.deleteAllTestUsers()
    cy.loginViaDescopeAPI()
  })

  it('shows welcome page', function () {
    cy.visit('/');
    cy.contains('Hello Test User').should('be.visible')
    })
})
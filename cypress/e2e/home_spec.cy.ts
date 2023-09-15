describe('Descope', function () {
  beforeEach(function () {
    cy.deleteAllTestUsers()
    cy.loginViaDescopeAPI()
  })

  it('shows test user welcome message', function () {
    cy.visit('/');
    cy.contains('Hello Test User').should('be.visible')
    })
})
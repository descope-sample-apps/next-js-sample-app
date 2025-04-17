describe('Descope', function () {
  beforeEach(function () {
    cy.deleteAllTestUsers()
    cy.loginViaDescopeUI()
    cy.loginViaDescopeAPI()
  })

  it('shows test user welcome message', function () {
    // cy.contains('Hello Test User').should('be.visible')
  })
})
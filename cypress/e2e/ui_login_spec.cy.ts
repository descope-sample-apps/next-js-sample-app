describe('Descope', function () {
  beforeEach(function () {
    cy.deleteAllTestUsers()
    cy.loginViaDescopeUI()
  })

  it('shows test user welcome message', function () {
    cy.contains('Hello Test User').should('be.visible')
  })
})
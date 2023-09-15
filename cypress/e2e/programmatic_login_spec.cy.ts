describe('Descope', function () {
  beforeEach(function () {
    cy.deleteAllTestUsers()
    cy.loginViaDescopeAPI()
  })

  it('shows test user welcome message', function () {
    cy.contains('Hello Test User').should('be.visible')
  })

  it('api request validated', function () {
    cy.get('[data-cy=api-form-button]').click()
    cy.contains('Result: Request Validated').should('be.visible');
  })
})
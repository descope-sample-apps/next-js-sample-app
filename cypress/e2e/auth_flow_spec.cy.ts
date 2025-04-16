describe('Descope', function () {
  // beforeEach(function () {
  //   cy.deleteAllTestUsers()
  // })

  before(() => {
    // Debug log to verify environment variables
    console.log('Project ID:', Cypress.env('descope_project_id'))
    console.log('Management Key exists:', !!Cypress.env('descope_management_key'))
  })

  it('shows test user welcome message', function () {
    // cy.contains('Hello Test User').should('be.visible')
  })

  it('validates api request', function () {
    // cy.get('[data-cy=api-form-button]').click()
    // cy.contains('Result: Request Validated').should('be.visible');
  })
})
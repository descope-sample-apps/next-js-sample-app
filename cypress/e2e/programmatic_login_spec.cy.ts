describe('Descope', function () {
  before(() => {
    // Debug log to verify environment variables
    console.log('Project ID:', Cypress.env('descope_project_id'))
    console.log('Management Key exists:', !!Cypress.env('descope_management_key'))
  })

  it('shows test user welcome message', function () {
    // Visit sign-in page and wait for it to load
    cy.visit('/sign-in', {
      onBeforeLoad(win) {
        // Prevent uncaught exceptions from failing the test
        cy.stub(win, 'onerror').as('winOnError')
      }
    })
    
    // Wait for the page to be fully loaded
    cy.window().should('have.property', 'onerror')
    
    // Debug: Log the Descope component state
    cy.get('descope-wc', { timeout: 10000 })
      .should('exist')
      .then($el => {
        console.log('Descope component found:', $el.length > 0)
        console.log('Component HTML:', $el[0].outerHTML)
      })
    
    // Enter email
    cy.get('descope-wc')
      .shadow()
      .find('input[type="email"]')
      .type('mrunank.pawar@descope.com', { force: true })
    
    // Wait for a moment before proceeding
    cy.wait(2000)
    
    // Note: Manual click of Continue button will be needed
    // After manual click, wait for OTP input
    cy.get('descope-wc')
      .shadow()
      .find('.descope-input-wrapper')
      .find('input')
      .should('exist')
      .should('be.visible')
    
    // Wait for manual OTP entry (give 30 seconds to enter OTP)
    cy.wait(30000)
    
    // After OTP entry, wait for authentication to complete
    cy.url().should('include', '/dashboard', { timeout: 30000 })
    
    // After successful authentication, verify welcome message
    cy.contains('Welcome, Mrunank Pawar', { timeout: 10000 }).should('be.visible')
    cy.contains('You are successfully authenticated with Descope').should('be.visible')

    // Test API connection and verify success message
    cy.contains('Test API Connection').click()
    cy.contains('API Request Successful!', { timeout: 10000 }).should('be.visible')
  })
})
describe('Authentication Flow', function () {
  beforeEach(function () {
    cy.deleteAllTestUsers();
    cy.loginViaDescopeUI();
  });

  it('shows welcome message after authentication', function () {
    // Wait for dashboard to load
    cy.url().should('include', '/dashboard');
    
    // Verify welcome message
    cy.contains('Welcome, Test User').should('be.visible');
    cy.contains('You are successfully authenticated with Descope').should('be.visible');
  });

  it('validates API connection', function () {
    // Wait for dashboard to load
    cy.url().should('include', '/dashboard');
    
    // Test API connection
    cy.contains('Test API Connection').click();
    cy.contains('API Request Successful!').should('be.visible');
  });
});
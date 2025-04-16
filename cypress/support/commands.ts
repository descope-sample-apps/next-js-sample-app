export {};
/// <reference types="cypress" />
// ***********************************************

const projectId = Cypress.env('descope_project_id');
const managementKey = Cypress.env('descope_management_key');
const descopeAPIDomain = "api.descope.com";

// Define the authorization header
const authHeader = {
  'Authorization': `Bearer ${projectId}:${managementKey}`,
};

// Define the base URL for Descope API
const descopeApiBaseURL = `https://${descopeAPIDomain}/v1`;

// Generate a unique test user login ID
const testUserLoginId = "testUser" + Math.floor(1000 + Math.random() * 9000) + "@gmail.com";

// Define the test user details (no password)
const testUser = {
  loginId: testUserLoginId,
  email: testUserLoginId,
  verifiedEmail: true,
  displayName: "Test User",
  test: true,
};

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to delete all test users
       * @example cy.deleteAllTestUsers()
       */
      deleteAllTestUsers(): Chainable;
    }
  }
}

// Add the deleteAllTestUsers command
Cypress.Commands.add('deleteAllTestUsers', () => {
  cy.request({
    method: 'DELETE',
    url: `${descopeApiBaseURL}/mgmt/user/test/delete/all`,
    headers: authHeader,
    failOnStatusCode: false,
  });
});

describe('TestViaUI: Sign Up or In and Dashboard Access', () => {
    beforeEach(() => {
        // Clear cookies and local storage before each test to ensure a fresh session
        cy.clearCookies();
        cy.clearLocalStorage();
      });
    // const testEmail = `testuser${Math.floor(1000 + Math.random() * 9000)}@mail.com`;
    const testEmail = `mrunank.pawar@descope.com`;
  
    it('should complete Descope Sign-Up or In flow and access dashboard', () => {
      cy.visit('/sign-in');

      cy.get('input[name="email"]', { timeout: 15000 }) 
        .should('be.visible')
        .type(testEmail);

      cy.wait(30000);
    });
});
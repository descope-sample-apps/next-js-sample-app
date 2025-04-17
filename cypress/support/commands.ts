/// <reference types="cypress" />
// ***********************************************

const projectId = Cypress.env('descope_project_id')
const managementKey = Cypress.env('descope_management_key')   
let descopeAPIDomain = "api.descope.com"
if (projectId.length >= 32) {
    const localURL = projectId.substring(1, 5)
    descopeAPIDomain = [descopeAPIDomain.slice(0, 4), localURL, ".", descopeAPIDomain.slice(4)].join('')
}

// Define the authorization header
const authHeader = {
    'Authorization': `Bearer ${projectId}:${managementKey}`,
}

// Define the base URL for Descope API
const descopeApiBaseURL = `https://${descopeAPIDomain}/v1`;

const testUserLoginId = "testUser" + Math.floor(1000 + Math.random() * 9000) + "@gmail.com"; // Must match email to pass validation

// Define the test user details
const testUser = {
    loginId: testUserLoginId,
    email: testUserLoginId,
    phone: "+11231231234",
    verifiedEmail: true,
    verifiedPhone: true,
    displayName: "Test User",
    test: true,
}
declare namespace Cypress {
  interface Chainable<Subject = any> {
    loginViaDescopeUI(): Chainable<any>;
    deleteAllTestUsers(): Chainable<any>;
    loginViaDescopeAPI(): Chainable<any>;
  }
}

// Add the loginViaDescopeUI command
Cypress.Commands.add('loginViaDescopeUI', () => {
    cy.request({
      method: 'POST',
      url: `${descopeApiBaseURL}/mgmt/user/create`,
      headers: authHeader,
      body: testUser,
    }).then(({ body }) => {
        if (!body?.user?.loginIds?.[0]) {
            throw new Error('Failed to create test user');
          }
      const loginId = body['user']['loginIds'][0];
      cy.request({
        method: 'POST',
        url: `${descopeApiBaseURL}/mgmt/tests/generate/otp`,
        headers: authHeader,
        body: {
          loginId: loginId,
          deliveryMethod: 'email',
        },
      }).then(({ body }) => {
        if (!body?.code || !body?.loginId) {
            throw new Error('Failed to generate OTP');
          }
        const otpCode = body['code'];
        const loginID = body['loginId'];
        cy.visit('/sign-in');
  
        cy.get('descope-wc').find('input').type(loginID);
  
        cy.get('descope-wc').find('descope-button').contains('Continue').click();
        cy.get('descope-wc').find('.descope-input-wrapper').find('input').should('exist'); // Assertion added to wait for the OTP code input to appear
        let otpCodeArray = Array.from(otpCode); // Convert the OTP code string to an array
        otpCodeArray.forEach((digit, index) => {
          cy.get(`descope-text-field[data-id="${index}"]`).then(($element) => {
            const shadowRoot = ($element[0] as HTMLElement).shadowRoot;
  
            if (shadowRoot) {
              const input = shadowRoot.querySelector('input') as HTMLInputElement | null;
  
              if (input) {
                input.value = String(digit);
                input.dispatchEvent(new InputEvent('input', { bubbles: true }));
              }
            }            
          });
        });
        cy.contains('button', 'Test API').click();

      // Confirm API success message is visible
      cy.contains('API Request Successful').should('be.visible');
      });
    });
  });

//   Add the deleteAllTestUsers command
  Cypress.Commands.add('deleteAllTestUsers', () => {
    cy.request({
      method: 'DELETE',
      url: `${descopeApiBaseURL}/mgmt/user/test/delete/all`,
      headers: authHeader,
    });
  });

// Add the deleteAllTestUsers command
Cypress.Commands.add('deleteAllTestUsers', () => {
    cy.request({
        method: 'DELETE',
        url: `${descopeApiBaseURL}/mgmt/user/test/delete/all`,
        headers: authHeader,
    })
})
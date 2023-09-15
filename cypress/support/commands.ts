/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }


//
// cypress/support/commands.js
//

const projectId = Cypress.env('descope_project_id')
const managementKey = Cypress.env('descope_management_key')
const descopeAPIDomain = "api.descope.com"



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
    })
        .then(({ body }) => {
            const loginId = body["user"]["loginIds"][0];
            cy.request({
                method: 'POST',
                url: `${descopeApiBaseURL}/mgmt/tests/generate/otp`,
                headers: authHeader,
                body: {
                    "loginId": loginId,
                    "deliveryMethod": "email"
                }
            })
                .then(({ body }) => {
                    const otpCode = body["code"]
                    const loginID = body["loginId"]
                    cy.visit('/login')

                    cy.get('descope-wc')
                        .find('input')
                        .type(loginID)
                    // If you haven't set `includeShadowDom: true` in your config (as recommended above), 
                    // you'll have to use `.shadow()` in each function call.
                    // So the previous line would look like this:
                    // cy.get('descope-wc').shadow().find('input').type(loginID)

                    cy.get('descope-wc')
                        .find('button').contains('Continue').click()
                    cy.get('descope-wc').find('.descope-input-wrapper').find('input').should('exist') // Assertion added to wait for the OTP code input to appear
                    let otpCodeArray: string[] = Array.from(otpCode); // Convert the OTP code string to an array
                    for (var i = 0; i < otpCodeArray.length; i++) {
                        cy.get('descope-wc').find('.descope-input-wrapper').find('input').eq(i + 1).type(otpCodeArray[i], { force: true })
                    }
                    cy.get('descope-wc')
                        .find('button').contains('Submit').click()

										// Customize these steps based on your authentication flow
                })
        })
})
// Add the loginViaDescopeAPI command
Cypress.Commands.add('loginViaDescopeAPI', () => {
    cy.request({
        method: 'POST',
        url: `${descopeApiBaseURL}/mgmt/user/create`,
        headers: authHeader,
        body: testUser,
    })
        .then(({ body }) => {
            const loginId = body["user"]["loginIds"][0];
            cy.request({
                method: 'POST',
                url: `${descopeApiBaseURL}/mgmt/tests/generate/otp`,
                headers: authHeader,
                body: {
                    "loginId": loginId,
                    "deliveryMethod": "email"
                }
            })
                .then(({ body }) => {
                    const otpCode = body["code"]
                    cy.request({
                        method: 'POST',
                        url: `${descopeApiBaseURL}/auth/otp/verify/email`,
                        headers: authHeader,
                        body: {
                            "loginId": loginId,
                            "code": otpCode
                        }
                    })
                        .then(({ body }) => {
                            const sessionJwt = body["sessionJwt"]
                            const refreshJwt = body["refreshJwt"]

                            /** Default name for the session cookie name / local storage key */
                            const SESSION_TOKEN_KEY = 'DS';
                            /** Default name for the refresh local storage key */
                            const REFRESH_TOKEN_KEY = 'DSR';

                            // // Store the JWT in the browser's local storage.
                            cy.window().then((win) => {
                                win.localStorage.setItem(SESSION_TOKEN_KEY, sessionJwt);
                                win.localStorage.setItem(REFRESH_TOKEN_KEY, refreshJwt);
                            });

                            // // Now navigate to the root URL of your application.
                            cy.visit('/')

                        })
                })
        })
})

// Add the deleteAllTestUsers command
Cypress.Commands.add('deleteAllTestUsers', () => {
    cy.request({
        method: 'DELETE',
        url: `${descopeApiBaseURL}/mgmt/user/test/delete/all`,
        headers: authHeader,
    })
})
import { loginWithPassword } from '../support/descope';

// Drives the two-route refresh race against the local stack with refresh token
// rotation enabled. Each test starts from a fresh login so it gets a fresh
// refresh token (Cypress clears cookies between tests).

// fires both routes from the page context so they share the browser cookies
const race = (delay: number) =>
  cy.wrap(null, { timeout: 60000 }).then(() =>
    cy.window({ timeout: 60000 }).then((win) =>
      Promise.all([
        win.fetch('/api/refresh-a').then((r) => r.json()),
        win.fetch(`/api/refresh-b?delay=${delay}`).then((r) => r.json()),
      ]),
    ),
  );

const refreshLatest = () =>
  cy.wrap(null, { timeout: 30000 }).then(() =>
    cy.window({ timeout: 30000 }).then((win) =>
      win.fetch('/api/refresh-latest').then((r) => r.json()),
    ),
  );

const run = (name: string, delay: number) => {
  loginWithPassword();
  race(delay).then((results) => {
    refreshLatest().then((latest) => {
      cy.writeFile(`cypress/out/rotation-${name}.json`, {
        delay,
        results,
        latest,
      } as unknown as Record<string, unknown>);
    });
  });
};

describe('concurrent refresh with token rotation', () => {
  it('both refresh at once', () => run('simultaneous', 0));
  it('second refresh inside the grace window', () => run('inside-grace', 1000));
  it('second refresh past the grace window', () => run('past-grace', 6000));
});

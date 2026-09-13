import { loginWithPassword } from '../support/descope';

// Logs in through the flow and hands the refresh token to the node script,
// which cannot sign in directly (password signin is disabled on the project).
describe('capture a refresh token', () => {
  it('writes DSR for scripts/rotation-grace.mjs', () => {
    loginWithPassword();
    cy.getCookies().then((cookies) => {
      const dsr = cookies.find((c) => c.name === 'DSR');
      expect(!!dsr, 'DSR cookie').to.equal(true);
      cy.writeFile('cypress/out/dsr.txt', dsr!.value);
    });
  });
});

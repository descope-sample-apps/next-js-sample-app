// Isolates the "Cannot read properties of null (reading 'removeChild')" crash
// that aborts the client side navigation away from the sign-in page.
// Each probe page renders one suspect and navigates away on click.

const probe = (path: string) => {
  const errors: string[] = [];

  cy.on('uncaught:exception', (err) => {
    errors.push(err.message);
    return false;
  });

  cy.visit(path);
  cy.get('[data-cy=nav]').should('exist');
  // let the page settle (web component render / animations running)
  cy.wait(3000);
  cy.get('[data-cy=nav]').click();

  cy.wrap(null).then(() => {
    cy.log(`${path} errors: ${errors.length ? errors.join(' | ') : 'none'}`);
    // eslint-disable-next-line no-console
    console.log(`RESULT ${path} :: ${errors.join(' | ') || 'no errors'}`);
    expect(errors.join(' | '), `uncaught exceptions on ${path}`).to.equal('');
  });
};

describe('navigation away from a mounted page', () => {
  it('descope web component only', () => probe('/probe/wc'));
  it('framer-motion only', () => probe('/probe/motion'));
});

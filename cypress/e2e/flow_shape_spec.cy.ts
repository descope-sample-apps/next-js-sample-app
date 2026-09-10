// diagnostic: what does the flow actually render, and does it reach a password screen
describe('flow shape', () => {
  it('dumps the first screen', () => {
    cy.on('uncaught:exception', () => false);
    cy.visit('/probe/wc');
    cy.get('descope-wc', { timeout: 20000 }).should('exist');
    cy.wait(6000);
    cy.get('descope-wc').then(($wc) => {
      const el = $wc[0] as HTMLElement;
      const root = el.shadowRoot ?? el;
      const tags = Array.from(root.querySelectorAll('*'))
        .map((n) => n.tagName.toLowerCase())
        .filter((t) => t.startsWith('descope-') || t === 'input' || t === 'button');
      cy.writeFile('cypress/out/flow-shape.json', {
        tags: [...new Set(tags)],
        text: (root.textContent || '').replace(/\s+/g, ' ').slice(0, 400),
        head: Array.from(document.head.children).map((n) => {
          const e = n as HTMLElement;
          const rel = e.getAttribute('rel');
          const href = e.getAttribute('href');
          return [e.tagName.toLowerCase(), rel, href?.slice(0, 60)].filter(Boolean).join(' ');
        }),
      });
    });
  });
});

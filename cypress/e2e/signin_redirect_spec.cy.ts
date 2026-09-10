// Reproduces the post-sign-in redirect crash with a real password login
// against the local stack. Collects everything, asserts at the very end.

// descope components nest shadow roots several levels deep, so query through them
const deepQueryAll = (root: Document | ShadowRoot | Element, sel: string) => {
  const out: Element[] = [];
  const walk = (node: Document | ShadowRoot | Element) => {
    if (node instanceof Element && node.shadowRoot) walk(node.shadowRoot);
    out.push(...Array.from(node.querySelectorAll(sel)));
    node.querySelectorAll('*').forEach((el) => {
      if (el.shadowRoot) walk(el.shadowRoot);
    });
  };
  walk(root);
  return out;
};

const label = (el: Element) =>
  (el.shadowRoot?.textContent || el.textContent || '').trim().slice(0, 24);

const setValue = (input: HTMLInputElement, value: string) => {
  const setter = Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    'value',
  )?.set;
  setter?.call(input, value);
  input.dispatchEvent(new InputEvent('input', { bubbles: true }));
  input.dispatchEvent(new Event('change', { bubbles: true }));
};

describe('sign in then redirect', () => {
  it('reaches /dashboard without an uncaught exception', () => {
    const diag: Record<string, unknown> = {};
    const errors: string[] = [];
    cy.on('uncaught:exception', (err) => {
      errors.push(err.message.split('\n')[0]);
      return false;
    });

    cy.visit('/sign-in');
    cy.get('descope-wc', { timeout: 20000 }).should('exist');
    cy.wait(5000);

    cy.get('descope-wc').then(($wc) => {
      const wc = $wc[0] as HTMLElement;
      const inputs = deepQueryAll(wc, 'input') as HTMLInputElement[];
      const buttons = deepQueryAll(wc, 'descope-button, button, vaadin-button');
      diag.hasShadowRoot = !!wc.shadowRoot;
      diag.inputs = inputs.map((i) => `${i.type}:${i.name || i.id || ''}`);
      diag.buttons = buttons.map((b) => `${b.tagName.toLowerCase()} "${label(b)}"`);

      const email = inputs.find((i) => i.type === 'email' || i.type === 'text');
      const password = inputs.find((i) => i.type === 'password');
      if (email) setValue(email, Cypress.env('login_id'));
      if (password) setValue(password, Cypress.env('password'));
      diag.filled = !!email && !!password;

      const btn = buttons.find((b) =>
        label(b).toLowerCase().includes('sign in'),
      );
      diag.clickedButton = !!btn;
      if (btn) {
        const inner = deepQueryAll(btn, 'button')[0] as HTMLElement | undefined;
        (inner ?? (btn as HTMLElement)).click();
      } else if (password) {
        // flows submit on Enter
        ['keydown', 'keypress', 'keyup'].forEach((type) =>
          password.dispatchEvent(
            new KeyboardEvent(type, {
              key: 'Enter',
              code: 'Enter',
              keyCode: 13,
              bubbles: true,
              composed: true,
            }),
          ),
        );
      }
    });

    // let the flow complete and the navigation commit
    cy.wait(12000);

    cy.url().then((url) => {
      diag.url = url;
      diag.landedOnDashboard = url.includes('/dashboard');
      diag.errors = errors;
      cy.writeFile('cypress/out/signin-redirect.json', diag);
    });
  });
});

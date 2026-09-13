// Helpers for driving a Descope flow from Cypress. The flow's inputs live
// several shadow roots deep, so they need a piercing query and native value
// setters rather than cy.type().

export const deepQueryAll = (
  root: Document | ShadowRoot | Element,
  sel: string,
) => {
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

export const setValue = (input: HTMLInputElement, value: string) => {
  Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    'value',
  )?.set?.call(input, value);
  input.dispatchEvent(new InputEvent('input', { bubbles: true }));
  input.dispatchEvent(new Event('change', { bubbles: true }));
};

// email + password on one screen, submitted with Enter (the flow's button
// label lives in a shadow root, so matching it by text is unreliable)
export const loginWithPassword = () => {
  cy.visit('/sign-in');
  cy.get('descope-wc', { timeout: 20000 }).should('exist');
  cy.wait(5000);
  cy.get('descope-wc').then(($wc) => {
    const inputs = deepQueryAll($wc[0], 'input') as HTMLInputElement[];
    const email = inputs.find((i) => i.type === 'email' || i.type === 'text');
    const password = inputs.find((i) => i.type === 'password');
    expect(!!email && !!password, 'email and password inputs').to.equal(true);
    setValue(email!, Cypress.env('login_id'));
    setValue(password!, Cypress.env('password'));
    ['keydown', 'keypress', 'keyup'].forEach((type) =>
      password!.dispatchEvent(
        new KeyboardEvent(type, {
          key: 'Enter',
          code: 'Enter',
          keyCode: 13,
          bubbles: true,
          composed: true,
        }),
      ),
    );
  });
  cy.url({ timeout: 20000 }).should('include', '/dashboard');
};

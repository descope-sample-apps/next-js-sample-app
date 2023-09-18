# Next Descope Example

## Getting Started

1. Create `.env.local` with the following variables:
```env
// .env.local
# Your project id
NEXT_PUBLIC_DESCOPE_PROJECT_ID=<project-id>
# Flow id to run, e.g. sign-up-or-in
NEXT_PUBLIC_DESCOPE_FLOW_ID=<flow-id>
# Optional - Descope base url, either https://api.descope.com, https://api.sandbox.descope.com or http://localhost:8000
NEXT_PUBLIC_DESCOPE_BASE_URL=<base-url>
```

Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## App Content
 This app contains 2 components:

### Home Page
a. When user is not logged-in:
 - "Login" button (navigate to "Login page")
 - "Not Validated" user data that returned from server side props (see more details below)
![home-page-not-logged-in](https://user-images.githubusercontent.com/10514677/206518925-16465344-f77d-4166-a0a5-22f9eea40438.png)

b. When user is logged-in
 - The logged in user name (or id)
 - "Logout" button
 - "Submit" form, to demonstrate api (form) usage (see more details below)
 - "Validated" user data that returned from server side props

![home-page-logged-in](https://user-images.githubusercontent.com/10514677/206575364-c574147b-18b0-4d0c-b6a6-af56c4ab7673.png)

 ### Login Page
 - Shows login flow (Descope component)
![login-page](https://user-images.githubusercontent.com/10514677/206518915-609865ce-196b-41be-9670-47278a72bd10.png)

## What Does Descope Example Shows?
#### Caveat
This is an early stage example. This example may change in the near future. We will appreciate any feedback!

 - `AuthProvider` usage
 The `App` component (`pages/_app.tsx`) is wrapped with `<AuthProvider ... > ... </AuthProvider>` component.

 - `useAuth` usage
The `Home` component (`pages/index.tsx`) uses multiple functions/constants return from this hook, such as `authenticated`, `user`, `logout` and more.

- `Descope` usage
The `Home` component (`pages/index.tsx`) loads Descope in a dynamic manner (CSR only), and renders it.

- Validating session
Validating session (`utils/auth.ts`) uses Descope `NodeJS` sdk instance's `validateSession` method.
This is used in
 - `getServerSideProps` (`pages/index.tsx`), to pass different data fetching.
 - API handler (`pages/api/form.ts`), to validate form request that is called from the `Home` page

 NOTE: In order to simplify the example - the session token is set to be stored on cookie by providing `sessionTokenViaCookie` prop to the `AuthProvider` component. Alternatively , you can also import `getSessionToken` function from `@descope/react-sdk` to get the token.

 
## 🧪 Testing

1. Set up Descope environment variables in `.env` file

```
NEXT_PUBCLIC_DESCOPE_PROJECT_ID="YOUR_DESCOPE_PROJECT_ID"
DESCOPE_MANAGEMENT_KEY="YOUR MANAGEMENT KEY" // Required
```

_You can get your project-id [here](https://app.descope.com/settings/project)_.
_You can get this flow-id from the Flows page [here](https://app.descope.com/flows)_.

2. Open the Cypress App
Make sure you have the application running at `https://localhost:3000`. Then, in the root directory of the descope-explorer project, run the following to open the Cypress app:

```
npx cypress open
```

You'll need to select "E2E Testing" and your preferred browser for testing. For more info, check out the [Cypress Docs](https://docs.cypress.io/guides/getting-started/opening-the-app).

3. Run E2E Tests
Now, simply click the "spec" you'd like to run and the test will start automatically.

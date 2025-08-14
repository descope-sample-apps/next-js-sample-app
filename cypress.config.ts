import { defineConfig } from "cypress";

import * as dotenv from 'dotenv';
dotenv.config();

export default defineConfig({
  
  e2e: {
    includeShadowDom: true, // Important for interacting with Descope components
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  env: {
    descope_project_id: process.env.NEXT_PUBLIC_DESCOPE_PROJECT_ID,
    descope_management_key: process.env.DESCOPE_MANAGEMENT_KEY
  },
});
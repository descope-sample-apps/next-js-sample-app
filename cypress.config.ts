import { defineConfig } from "cypress";
import * as dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  e2e: {
    includeShadowDom: true, // Important for interacting with Descope components
    baseUrl: 'http://localhost:3000',
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    setupNodeEvents(on, config) {
      // implement node event listeners here
      return config;
    },
  },
  env: {
    // descope_project_id: process.env.NEXT_PUBLIC_DESCOPE_PROJECT_ID,
    // descope_management_key: process.env.DESCOPE_MANAGEMENT_KEY
    descope_project_id: "P2vjiqpAqvQuklO58bTHdB5LtPsw",
    descope_management_key: "K2vmBaFYc1Qhj8yi2BBogEM96MeHbCBhekPjCaxLWgnY0gnEvJf4cHCL8OGEsbPaUPvsf25"
  },
});

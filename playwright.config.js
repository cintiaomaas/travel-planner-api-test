require('dotenv').config();
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30 * 1000,
  expect: {
    timeout: 5000
  },
  reporter: [ ['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }] ]
});

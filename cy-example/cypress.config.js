const { defineConfig } = require("cypress");

module.exports = defineConfig({
  retries: 3,
  taskTimeout: 10,
  execTimeout: 10,
  requestTimeout: 10,
  pageLoadTimeout: 10,
  responseTimeout: 10,
  e2e: {
    supportFile: false,
    specPattern: "cy-example/e2e/*.cy.js",
    reporter: "cypress-junit-reporter",
    reporterOptions: {
      mochaFile: "cy-example/results-[hash].xml",
      toConsole: true,
    },
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});

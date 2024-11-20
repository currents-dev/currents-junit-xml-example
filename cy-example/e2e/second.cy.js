describe("Second Test Suite", () => {
  it("visits google", () => {
    cy.visit("https://www.google.com");
    cy.title().should("include", "Google");
  });

  it("can search", () => {
    cy.visit("https://www.google.com");
    cy.get('[name="q"]').type("Cypress testing{enter}");
  });
});

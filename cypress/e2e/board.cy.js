describe("Board Component", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173");
    cy.window().then((win) => {
      win.localStorage.clear();
    });
    cy.reload();
  });

  it("displays the board", () => {
    cy.get("div").should("exist");
  });

  it("can add a card to a list", () => {
    cy.get("button").contains("Add card").first().click();
    cy.wait(100);
    cy.get(".bg-gray-100").should("exist");
  });

  it("can open and edit card", () => {
    cy.get("button").contains("Add card").first().click();
    cy.wait(100);
    cy.get(".cursor-pointer").first().click();
    cy.wait(500);
    cy.get("input").first().clear().type("Test Card");
    cy.get("button").contains("Save").click();
    cy.contains("Test Card").should("exist");
  });
});

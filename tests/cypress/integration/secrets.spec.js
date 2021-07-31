describe('Secret Server App', () => {
    describe('Landing Page', () => {
        beforeEach(() => {
            cy.visit("localhost:3000");
        });

        it('should open the landing page', () => {
            cy.get("h1").should('have.length', 1);
            cy.get("h1").shouldHaveTrimmedText("Secret Server");

            cy.get(".card").should('have.length', 2);

            cy.get(".card").first().within(() => {
                cy.get("a").should('have.attr', 'href', '/create');
            })

            cy.get(".card").last().within(() => {
                cy.get("a").should('have.attr', 'href', '/secrets');
            })
        });

        it('should get to the create page with the button', () => {
            cy.get(".card").first().within(() => {
                cy.get("a").should('have.attr', 'href', '/create').click();
                cy.url().should("include", "/create");
            })
        });

        it('should visit the secrets page', () => {
            cy.get(".card").last().within(() => {
                cy.get("a").should('have.attr', 'href', '/secrets').click();
                cy.url().should("include", "/secrets");
            })
        })
    });

    describe("Create Secret Page", () => {
        beforeEach(() => {
            cy.visit("localhost:3000/create");
        })

        it('should open the create page', () => {
            cy.get("h1").shouldHaveTrimmedText("Create new secret");
            cy.get("input").should('have.length', 3);
            cy.get("button").should('have.length', 1).shouldHaveTrimmedText("Save Secret");
            cy.get('a').should('have.length', 1).shouldHaveTrimmedText("See the saved secrets");
            cy.get("ul").should('have.length', 0);
        });

        it('get error when creating secret with invalid data', () => {
            cy.get("button").click();

            cy.get("ul").should('have.length', 1);
            cy.get("li").first().shouldHaveTrimmedText("You must provide text for the secret!");

            cy.get("#ttl").clear().type("-1");
            cy.get("#allowed-views").clear().type("0");

            cy.get("button").click();

            cy.get("li").should('have.length', 4);

            cy.get("li").eq(0).shouldHaveTrimmedText("You must provide text for the secret!");
            cy.get("li").eq(1).shouldHaveTrimmedText("Time to live must be positive value or 0!");
            cy.get("li").eq(2).shouldHaveTrimmedText("You must provide how many times a secret should be shown!");
            cy.get("li").eq(3).shouldHaveTrimmedText("Allowed views must be a positive number!");
        });

        it('should create a secret with valid data', () => {
            cy.get("#secret-text").clear().type("Test");
            cy.get("#ttl").clear().type(1000);
            cy.get("#allowed-views").clear().type(50);

            cy.get("button").click();

            cy.get(".alert.alert-success").should("have.length", 1);

            cy.vStore()
                .its("getters.secrets/secrets")
                .should(secrets => {
                    expect(secrets.length).equal(1);
                    const {
                        remainingViews,
                        secretText,
                        expiresAt,
                        hash
                    } = secrets[0];

                    expect(remainingViews).equal(50);
                    expect(secretText).equal("Test");
                    expect(new Date(expiresAt).getTime()).greaterThan(Date.now());
                    expect(localStorage.getItem("secrets")).equal(JSON.stringify(secrets));
                });
        });

        it('should navigate to the get secrets page', () => {
            cy.get("a").click();

            cy.url().should("include", "/secrets");
        })
    });

    describe.only("Saved Secrets Page", () => {
        beforeEach(() => {
            cy.visit("localhost:3000/create");

            cy.get("#secret-text").clear().type(`Test${Date.now()}`);
            cy.get("#ttl").clear().type(0);
            cy.get("#allowed-views").clear().type(50);

            cy.get("button").click();

            cy.get("a").click();

            cy.vStore()
                .its("getters.secrets/secrets")
                .as("secret")
        });

        it("should open the saved secrets page", () => {
            cy.get("h1").shouldHaveTrimmedText("Saved secrets");
            cy.get("input").should("have.length", 1);
            cy.get("button").should("have.length", 1).and("have.attr", "disabled");
            cy.get("li").should("have.length", 1);
            cy.get(".badge").shouldHaveTrimmedText(50);
        });

        it("should get a secret by hash", () => {
            cy.get("@secret").then(([secret]) => {
                cy.get("input").clear().type(secret.hash);
                cy.get("button").click();

                cy.get(".card").should("have.length", 1);
                cy.get(".card-title").contains(secret.secretText);
                cy.get(".card-subtitle").shouldHaveTrimmedText(secret.hash)

                cy.get(".badge").first().shouldHaveTrimmedText(49);
                cy.get(".badge").last().shouldHaveTrimmedText(49);

                cy.get("span").first().click();

                cy.get(".badge").first().shouldHaveTrimmedText(48);
                cy.get(".badge").last().shouldHaveTrimmedText(48);
            })
        });
    })
})

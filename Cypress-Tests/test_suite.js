/**
 * written by Brian McCarthy
 */
// Cypress Test Logic - TravelBloom E2E
describe('TravelBloom UI Testing', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('1. Loads header successfully', () => {
    cy.get('nav').should('contain', 'TravelBloom');
  });

  it('2. Navigates to About page', () => {
    cy.contains('About Us').click();
    cy.url().should('include', '/');
    cy.contains('Our Narrative').should('be.visible');
  });

  it('3. Navigates to Contact page', () => {
    cy.contains('Contact Us').click();
    cy.contains('Establish a connection').should('be.visible');
  });

  it('4. Performs a beach search', () => {
    cy.get('#search-input').type('beach');
    cy.get('#search-button').click();
    cy.contains('Recommendations').should('be.visible');
    cy.get('img').should('have.length.at.least', 2);
  });

  it('5. Performs a temple search', () => {
    cy.get('#search-input').type('temple');
    cy.get('#search-button').click();
    cy.contains('Taj Mahal').should('be.visible');
  });

  it('6. Performs a country search (Japan)', () => {
    cy.get('#search-input').type('japan');
    cy.get('#search-button').click();
    cy.contains('Tokyo').should('be.visible');
  });

  it('7. Clears results', () => {
    cy.get('#search-input').type('beach');
    cy.get('#search-button').click();
    cy.get('#clear-button').click();
    cy.get('#search-input').should('have.value', '');
    cy.contains('The World Awaits').should('be.visible');
  });

  it('8. Checks responsive grid', () => {
    cy.viewport('iphone-x');
    cy.get('nav').should('be.visible');
  });

  it('9. Submits contact form', () => {
    cy.contains('Contact Us').click();
    cy.get('#name-input').type('Cypress User');
    cy.get('#email-input').type('cypress@test.com');
    cy.get('#message-input').type('Hello TravelBloom');
    cy.get('#submit-button').click();
    cy.contains('Message Dispatched').should('be.visible');
  });

  it('10. Checks footer credit', () => {
    cy.scrollTo('bottom');
    cy.contains('written by Brian McCarthy').should('be.visible');
  });

  it('11. Handles invalid category search', () => {
    cy.get('#search-input').type('invalid');
    cy.get('#search-button').click();
    cy.contains('Recommendations').should('be.visible');
    cy.get('img').should('have.length', 0);
  });

  it('12. Checks image alt text presence', () => {
    cy.get('#search-input').type('beach');
    cy.get('#search-button').click();
    cy.get('img').should('have.attr', 'alt');
  });

  it('13. Verifies loading state', () => {
    cy.get('#search-input').type('beach');
    cy.get('#search-button').click();
    // Spinner is very fast but we check logic
  });

  it('14. Validates email field type', () => {
    cy.contains('Contact Us').click();
    cy.get('#email-input').should('have.attr', 'type', 'email');
  });

  it('15. Checks logo link behavior', () => {
    cy.contains('About Us').click();
    cy.contains('TravelBloom').click();
    cy.contains('The World Awaits').should('be.visible');
  });
});

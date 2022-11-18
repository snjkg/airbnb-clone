describe('happy path of user', () => {
  const email_1 = 'alice'+(Math.random() + 1).toString(36).substring(7)+'@yahoo.com'
  const email_2 = 'bob'+(Math.random() + 1).toString(36).substring(7)+'@yahoo.com'
  it('register, should immediately be logged in and able to logout', () => {
  
    // register an account
    cy.visit('http://localhost:3000/')
    cy.wait(1000)
    
    cy.get('[href="/account/register"]').click();

    cy.get('#name').type('Alice');

    cy.get('#email').type(email_1);

    cy.get('#password').type('a');

    cy.get('#confirm_password').type('a');
    cy.get('form > button').click();
    cy.wait(1000)
    
    // logout
    cy.get('button > span > .mantine-NavLink-label').should('have.text', 'Logout');
    
    cy.get('button > span > .mantine-NavLink-label').click();
    
    cy.get('[href="/account/login"] > span > .mantine-NavLink-label').should('have.text', 'Login');

  })
  
  const apartment_name = 'My apartment '+(Math.random() + 1).toString(36).substring(7);
  it('login and create listing and publish it', () => {
  
  
    // login

    cy.visit('http://localhost:3000/')
    cy.wait(1000)

    cy.get('[href="/account/login"]').click();

    cy.get('#email').type(email_1);

    cy.get('#password').type('a');

    cy.get('form > button').click();
    cy.wait(1000)
    
    // create listing

    cy.get('.mantine-Title-root').should('have.text', 'My Listings');
    cy.get('.mantine-qo1k2').click();
    cy.get('#title').type(apartment_name);
    cy.get('#price').type('100');
    cy.get('#type').type('Room{downarrow}{enter}');
    cy.get('#street').type('1 Anzac Pde');
    cy.get('#city').type('Kensington');
    cy.get('#state').type('NSW');
    cy.get('#postcode').type('2033');
    cy.get('#country').type('Australia{downarrow}{enter}');
    cy.get('input[type="file"]').selectFile('cypress/fixtures/apartment1.jpeg',{force: true});

    cy.get('form figure img').should('have.attr', 'alt', 'Thumbnail of Listing');
    cy.get('form').submit() 
    cy.wait(1000)
    
    cy.get('div.mantine-Col-root a.mantine-Group-root').should('have.text', apartment_name);
    cy.get('div.mantine-Col-root .mantine-NavLink-label:contains("Publish")').click();
    cy.get('.mantine-Modal-root button:contains("Add")').click();
    cy.get('.mantine-Modal-root button:contains("Save")').click();
    // cy.get('div.mantine-Col-root .mantine-NavLink-label:contains("Unpublish")').click();

  })
  
  it('register second user who books this apartmet', () => {
  
    // register an account
    cy.visit('http://localhost:3000/')
    cy.wait(1000)
    
    cy.get('[href="/account/register"]').click();

    cy.get('#name').type('Bob');

    cy.get('#email').type(email_2);

    cy.get('#password').type('b');

    cy.get('#confirm_password').type('b');
    cy.get('form > button').click();
    
    cy.wait(1000)
    
    // find listing
    cy.get('nav [href="/"]').click();
    cy.wait(1000)
    
    cy.get('h4:contains("'+apartment_name+'")').click();
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    cy.get('.mantine-RangeCalendar-month button').contains(new RegExp('^'+today.getDate()+'$','g')).click();
    cy.get('.mantine-RangeCalendar-month button').contains(new RegExp('^'+tomorrow.getDate()+'$','g')).click();
    cy.get('button:not([disabled]):contains("Book Now")').click();
  })
  
  it('edit & unpublish listing', () => {
  
  
    // login

    cy.visit('http://localhost:3000/')
    cy.wait(1000)

    cy.get('[href="/account/login"]').click();

    cy.get('#email').type(email_1);

    cy.get('#password').type('a');

    cy.get('form > button').click();
    cy.wait(1000)
  
    // edit listing
    cy.get('div.mantine-Col-root .mantine-NavLink-label:contains("Edit")').click();
    cy.get('form figure img').click;
    
    cy.get('input[type="file"]').selectFile('cypress/fixtures/apartment2.jpeg',{force: true});

    cy.get('form figure img').should('have.attr', 'alt', 'Thumbnail of Listing');
    
    cy.get('#title').type(' BEST!!');
    cy.get('form').submit() 
    
    // unpublish listing

    cy.get('div.mantine-Col-root .mantine-NavLink-label:contains("Unpublish")').click();

  })
  
  
})
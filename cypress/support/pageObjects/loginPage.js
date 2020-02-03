import SurveyorHomePage from './surveyorHomePage'
import CustomerHomePage from './customerHomePage'

export default class LoginPage {
  visit = () => {
    cy.visit('/')
  }

  typeEmail = email => {
    cy.get('input[id=email]')
      .clear()
      .type(email)
  }

  typePWD = pwd => {
    cy.get('input[id=password]').type(pwd)
  }

  login = (email, pwd) => {
    cy.get('input[id=email]')
      .clear()
      .type(email)
    cy.get('input[id=password]').type(pwd)

    cy.get('button')
      .contains('Login')
      .click({ force: true })
      .wait(4000)

    if (email.startsWith('surveyor')) {
      return new SurveyorHomePage()
    }
    return new CustomerHomePage()
  }

  checkLocalStorage = () => {
    cy.contains('Login').should(() => {
      expect(localStorage).to.have.length(0)
    })
  }
}

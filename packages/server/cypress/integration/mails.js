/*
 * This file is part of Athene2.
 *
 * Copyright (c) 2013-2018 Serlo Education e.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @copyright Copyright (c) 2013-2018 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/athene2 for the canonical source repository
 */
/// <reference types="Cypress" />
context('Notification Mails', () => {
  const baseUrl = 'http://de.serlo.localhost:4567'
  beforeEach(() => {
    cy.request('http://de.serlo.localhost:4567/mails/clear')
  })
  it('Reset password mail renders correctly', () => {
    const username = 'admin'
    const email = 'admin@localhost'
    cy.visit(baseUrl + '/auth/password/restore')
    // TODO: "mocking" the post doesn't work somehow
    cy.get('input[name=email]').type(email)
    // TODO: submitting the form directly doesn't work somehow
    cy.get('button[name=submit]').click()
    cy.request(baseUrl + '/mails/list').then(response => {
      const { body } = response
      expect(body.flushed).to.have.length(1)
      const { to, mail } = body.flushed[0]
      expect(to).to.equal(email)
      expect(mail.body)
        .to.include('<')
        .and.not.include('&lt')
      expect(mail.plain)
        .to.not.include('<')
        .and.to.not.include('&lt')
      expect(mail.body)
        .to.include(username)
        .and.to.match(
          /<a href="http:\/\/de\.serlo\.(.*?)\/auth\/password\/restore\/(\w*?)">/
        )
      expect(mail.plain)
        .to.include(username)
        .and.to.match(
          /http:\/\/de\.serlo\.(.*?)\/auth\/password\/restore\/(\w*?)/
        )
    })
  })
})

function login() {
  cy.request('http://de.serlo.localhost:4567/auth/login', {
    user: 'admin@localhost',
    password: '123456'
  })
}

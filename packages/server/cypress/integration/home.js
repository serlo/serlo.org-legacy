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

context('Home', () => {
  it('de.serlo.localhost has the correct document title', () => {
    cy.visit('http://de.serlo.localhost:4567/')
    cy.title().should('equal', 'Serlo – Die freie Lernplattform')
  })

  it('en.serlo.localhost has the correct document title', () => {
    cy.visit('http://en.serlo.localhost:4567/')
    cy.title().should('equal', 'Serlo – The Open Learning Platform')
  })

  it('es.serlo.localhost has the correct document title', () => {
    cy.visit('http://es.serlo.localhost:4567/')
    cy.title().should(
      'equal',
      'Serlo – La Plataforma para el Aprendizaje Abierto'
    )
  })

  it('hi.serlo.localhost has the correct document title', () => {
    cy.visit('http://hi.serlo.localhost:4567/')
    cy.title().should('equal', 'सेर्लो – ओपन लर्निंग प्लेटफॉर्म')
  })
})

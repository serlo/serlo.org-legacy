/**
 * This file is part of Serlo.org.
 *
 * Copyright (c) 2013-2021 Serlo Education e.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @copyright Copyright (c) 2013-2021 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/serlo.org for the canonical source repository
 */
import { storiesOf } from '@storybook/react'
import { Editor } from '@serlo/edtr-io'
import { initI18n, setLanguage } from '@serlo/i18n'
import { select } from '@storybook/addon-knobs'
import * as React from 'react'

interface Story {
  name: string
  type: string
  initialState: unknown | { name: string; state: unknown }[]
}

export function addStory({ name, type, initialState }: Story) {
  const stories = storiesOf(name, module)
  const initialStates: { name: string; state: unknown }[] = (initialState as {
    name: string
    state: unknown
  }[]).length
    ? (initialState as { name: string; state: unknown }[])
    : [{ name: '', state: initialState }]

  initialStates.forEach(({ name, state }) => {
    stories.add(`${name} Editor`, () => {
      return (
        <Container>
          <Editor
            getCsrfToken={() => ''}
            type={type}
            initialState={state}
            onSave={mockSave}
            mayCheckout
          />
        </Container>
      )
    })
  })
}

export function addContentTypeStory({ name, ...other }: Story) {
  addStory({ ...other, name: `Content Types/${name}` })
}

export function addPluginStory({ name, initialState }: Omit<Story, 'type'>) {
  addStory({ name: `Plugins/${name}`, type: 'page', initialState })
}

export function Provider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = React.useState(false)
  const language = select(
    'Language',
    {
      English: 'en',
      German: 'de',
      DEBUG: 'cimode',
    },
    'en'
  )

  React.useEffect(() => {
    initI18n({
      language,
      resources: require('i18next-resource-store-loader!@serlo/i18n/resources'),
    }).then(() => {
      setReady(true)
    })
  }, [])
  React.useEffect(() => {
    setLanguage(language).then(() => {
      console.log('language changed')
    })
  }, [language])

  if (!ready) return null

  return <React.Fragment>{children}</React.Fragment>
}

export function Container({ children }: React.PropsWithChildren<{}>) {
  return (
    <Provider>
      <link href="http://localhost:8081/main.css" rel="stylesheet" />
      <div>
        <div
          className="wrap has-navigation has-context"
          style={{
            marginBottom: '-183px',
          }}
        >
          <header id="header">
            <nav
              id="serlo-menu"
              className="navbar navbar-default"
              role="navigation"
            >
              <div className="container-fluid">
                <div className="collapse navbar-collapse" id="top-bar-collapse">
                  <nav className="navbar-inner">
                    <ul className="nav navbar-nav">
                      <li>
                        <a href="#" className="">
                          <span className="fa fa-home" />
                        </a>
                      </li>
                      <li className="dropdown">
                        <a className="primary" href="#" data-toggle="dropdown">
                          Fächer <b className="caret" />
                        </a>
                        <ul className="dropdown-menu">
                          <li>
                            <a href="#"> Mathematik </a>
                          </li>
                          <li>
                            <a href="#"> Biologie </a>
                          </li>
                          <li>
                            <a href="#"> Angewandte Nachhaltigkeit </a>
                          </li>
                          <li>
                            <a href="#"> Schulfächer im Aufbau </a>
                          </li>
                        </ul>
                      </li>
                      <li>
                        <a href="#" className="">
                          Mitmachen
                        </a>
                      </li>
                      <li>
                        <a href="#" className="">
                          Spenden
                        </a>
                      </li>
                      <li>
                        <a href="#" className="">
                          Über Serlo
                        </a>
                      </li>
                      <li>
                        <a href="#" className="">
                          Blog
                        </a>
                      </li>
                    </ul>
                    <ul className="nav navbar-nav navbar-right authentication">
                      <li>
                        <a href="#" className="">
                          Registrieren
                        </a>
                      </li>
                      <li>
                        <a href="#" className="">
                          <span className="fa fa-user" /> Anmelden
                        </a>
                      </li>
                    </ul>
                    <ul className="nav navbar-nav pull-right notifications hidden-xs" />
                    <ul className="nav navbar-nav navbar-right">
                      <li>
                        <a href="#" className="">
                          Community
                        </a>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            </nav>
            <div className="container">
              <nav id="header-nav">
                <div id="mobile-nav-toggle">
                  <button>
                    <span className="sr-only">Navigation ein-/ausblenden</span>
                    <i className="fa fa-fw fa-bars" />
                  </button>
                  <a className="main-headline-link" href="#">
                    <span className="serlo-logo">V</span>
                  </a>
                  <div className="serlo-brand">Serlo</div>
                  <span className="subject-title hidden-xs">
                    <a className="main-headline-link" href="#">
                      Mathematik
                    </a>
                  </span>
                </div>
                <div id="mobile-nav-right">
                  <ul className="authentification nav navbar-nav">
                    <li className="dropdown">
                      <a
                        data-toggle="dropdown"
                        className="dropdown-toggle"
                        href="#"
                        aria-expanded="false"
                      >
                        <span className="fa fa-user" />
                      </a>
                      <ul className="dropdown-menu dropdown-menu-right">
                        <li>
                          <a href="#" className="">
                            Registrieren
                          </a>
                        </li>
                        <li>
                          <a href="#" className="">
                            <span className="fa fa-user" /> Anmelden
                          </a>
                        </li>
                      </ul>
                    </li>
                  </ul>
                  <ul className="notifications nav navbar-nav" />
                </div>
              </nav>
              <div id="mobile-nav">
                <ul id="mobile-serlo-nav" className="nav">
                  <li className="dropdown">
                    <a href="#" data-toggle="dropdown">
                      Serlo <b className="caret" />
                    </a>
                    <ul className="dropdown-menu">
                      <li>
                        <a href="#" className="">
                          <span className="fa fa-home" />
                        </a>
                      </li>
                      <li>
                        <a href="#" className="">
                          Mitmachen
                        </a>
                      </li>
                      <li>
                        <a href="#" className="">
                          Spenden
                        </a>
                      </li>
                      <li>
                        <a href="#" className="">
                          Über Serlo
                        </a>
                      </li>
                      <li>
                        <a href="#" className="">
                          Blog
                        </a>
                      </li>
                      <li>
                        <a href="#" className="">
                          Community
                        </a>
                      </li>
                      <li>
                        <a href="#" className="">
                          Newsletter
                        </a>
                      </li>
                      <li>
                        <a href="#" className="">
                          <span className="fa fa-facebook-square" />
                          <span className="sr-only">Facebook</span>
                        </a>
                      </li>
                      <li>
                        <a href="#" className="">
                          <span className="fa fa-twitter-square" />
                          <span className="sr-only">Twitter</span>
                        </a>
                      </li>
                    </ul>
                  </li>
                </ul>
                <ul id="mobile-primary-nav" className="nav">
                  <li className="dropdown">
                    <a className="primary" href="#" data-toggle="dropdown">
                      Fächer <b className="caret" />
                    </a>
                    <ul className="dropdown-menu">
                      <li>
                        <a href="#"> Mathematik </a>
                      </li>
                      <li>
                        <a href="#"> Biologie </a>
                      </li>
                      <li>
                        <a href="#"> Angewandte Nachhaltigkeit </a>
                      </li>
                      <li>
                        <a href="#"> Schulfächer im Aufbau </a>
                      </li>
                    </ul>
                  </li>
                </ul>
                <ul id="mobile-main-nav" className="nav">
                  <li className="mobile-nav-header">
                    <a className="is-hidden" href="#" itemProp="url">
                      <span itemProp="title">Informatik</span>
                    </a>
                  </li>
                  <li
                    data-needs-fetching="true"
                    data-sidenav="false"
                    itemProp="child"
                    itemScope
                    itemType="http://data-vocabulary.org/Breadcrumb"
                    className="active"
                    data-identifier="8399af0083b7e80e408bd8e93554eb56"
                  >
                    <a href="#" itemProp="url">
                      <span itemProp="title">Alle Themen</span>
                    </a>
                  </li>
                  <li data-identifier="82a831faa7f516125a8c4accd0e6bbe7">
                    <a href="#">
                      <span>Gymnasium</span>
                    </a>
                  </li>
                  <li
                    data-needs-fetching="true"
                    className="is-community dropdown"
                    data-identifier="b8b03f26f366eab97bef52ddd36637a1"
                  >
                    <a href="#" data-toggle="dropdown">
                      <span>Bei Serlo-Mathematik mitarbeiten</span>
                      <b className="caret" />
                    </a>
                    <ul className="dropdown-menu">
                      <li
                        data-needs-fetching="false"
                        data-identifier="824a5560d7d4b2153fbf7dbc8af5d6bc"
                      >
                        <a href="#">Neu hier?</a>
                      </li>
                      <li
                        data-needs-fetching="false"
                        data-identifier="e2a2fee756302401bad18e807a8d9e9b"
                      >
                        <a href="#">Ungeprüfte Bearbeitungen</a>
                      </li>
                      <li
                        data-needs-fetching="false"
                        data-identifier="6274acc4e9ffdcfa46f003de82dbf1fe"
                      >
                        <a href="#">Papierkorb</a>
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
              <div
                id="subject-nav-sticky-wrapper"
                className="sticky-wrapper"
                style={{
                  height: '45px',
                }}
              >
                <nav id="subject-nav">
                  <div id="subject-nav-wrapper">
                    <div className="subject-nav-center">
                      <div className="pull-right controls"></div>
                      <ol id="breadcrumbs" />
                    </div>
                    <div id="search-content">
                      <form
                        method="get"
                        className="form-search inline"
                        role="search"
                        action="#"
                      >
                        <div className="form-group">
                          <div className="input-group">
                            <input
                              id="search-input"
                              placeholder="Suchen"
                              tabIndex={-1}
                              name="q"
                              type="search"
                            />
                            <div className="input-group-addon">
                              <button type="submit" className="btn">
                                <i className="fa fa-lg fa-search" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </nav>
              </div>
            </div>
          </header>
          <div id="page" className="container clearfix has-sidebar">
            <aside className="side-navigation side-element">
              <div className="layout-toggle">
                <i className="fa fa-bars" />
                <i className="fa fa-times" />
              </div>
              <div className="side-element-inner">
                <nav>
                  <div id="navigation-content">
                    <ul
                      id="main-nav"
                      className="nav"
                      itemScope
                      itemType="http://data-vocabulary.org/Breadcrumb"
                    >
                      <li data-identifier="82a831faa7f516125a8c4accd0e6bbe7">
                        <a href="#">
                          <span>Gymnasium</span>
                        </a>
                      </li>
                      <li
                        data-needs-fetching="true"
                        className="is-community"
                        data-identifier="b8b03f26f366eab97bef52ddd36637a1"
                      >
                        <a href="#">
                          <span>Bei Serlo-Mathematik mitarbeiten</span>
                        </a>
                        <ul> </ul>
                      </li>
                    </ul>
                  </div>
                </nav>
                <ul id="side-navigation-social">
                  <li>
                    <a href="#" className="">
                      Newsletter
                    </a>
                  </li>
                  <li>
                    <a href="#" className="">
                      <span className="fa fa-facebook-square" />
                      <span className="sr-only">Facebook</span>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="">
                      <span className="fa fa-twitter-square" />
                      <span className="sr-only">Twitter</span>
                    </a>
                  </li>
                </ul>
              </div>
            </aside>
            <section className="main clearfix">
              <div id="content-layout" className="content clearfix">
                {children}
              </div>
              <aside className="side-element side-context" />
              <div id="horizon" />
            </section>
          </div>
        </div>
        <script type="text/javascript" src="http://localhost:8081/main.js" />
      </div>
    </Provider>
  )
}

export function mockSave(data: unknown): Promise<void> {
  console.log(data)
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, 1000)
  })
}

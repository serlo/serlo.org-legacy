/**
 * This file is part of Serlo.org.
 *
 * Copyright (c) 2013-2020 Serlo Education e.V.
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
 * @copyright Copyright (c) 2013-2020 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/serlo.org for the canonical source repository
 */
export const exampleApiParameters = ['contentOnly', 'hideBanner', 'fullWidth']

export const navigation = {
  login: 'Anmelden',
  logout: 'Abmelden'
}

export const pages = {
  login: {
    defaultPassword: '123456',
    path: '/auth/login',
    identifier: {
      inputUser: 'E-Mail-Adresse oder Benutzername',
      inputPassword: 'Passwort',
      buttonLogin: 'Login'
    }
  },
  logout: {
    path: "/auth/logout"
  }
}

export const testingServerUrl = 'http://de.serlo.localhost:4567'

export const users = [ "login", "german_reviewer", "german_helper", "admin" ]

export const viewports = {
  desktop: {
    width: 1920,
    height: 1080
  }
}

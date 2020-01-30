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
  addContent: 'Add content',
  dropdownToggle: '#subject-nav-wrapper button.dropdown-toggle',
  login: 'Log in',
  logout: 'Log out',
  saveButton: '#subject-nav-wrapper .fa-save',
  editButton: '#subject-nav-wrapper .fa-pencil',
  backLink: '.page-header a'
}

export const pages = {
  e2eTopic: {
    path: '/math/area-e2e-tests',
    id: '35566'
  },
  login: {
    defaultPassword: '123456',
    path: '/auth/login',
    identifier: {
      inputUser: 'Email address or Username',
      inputPassword: 'Password',
      buttonLogin: 'Login'
    }
  },
  logout: {
    path: '/auth/logout'
  }
}

export const testingServerUrl = 'http://en.serlo.localhost:4567'

export const users = ['login', 'german_reviewer', 'german_helper', 'admin']

export const viewports = {
  desktop: {
    width: 1920,
    height: 1080
  }
}

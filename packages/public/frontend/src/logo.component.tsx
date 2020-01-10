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
import * as React from 'react'
import styled from 'styled-components'
import {
  getColor,
  lightenColor,
  transparentizeColor
} from './provider.component'

import { getPath } from './assets'

export interface Props {
  subline?: string
  dark?: boolean
  //link href
}

export default function Logo(props: Props) {
  return (
    <React.Fragment>
      <Header>
        <Link href=".">
          <Image
            alt="Serlo"
            src={getPath(
              props.dark ? '/img/serlo-logo-white.svg' : '/img/serlo-logo.svg'
            )}
          />
        </Link>
      </Header>
      {!props.subline ? null : (
        <SublineH2>
          <SublineLink
            className="subline icon"
            href="#subject"
            dark={props.dark}
          >
            {props.subline}
          </SublineLink>
        </SublineH2>
      )}
    </React.Fragment>
  )
}

const Header = styled.h1`
  padding-bottom: 0;
  margin-bottom: -0.85rem;
`

const Link = styled.a`
  border: 0 !important;
  padding-bottom: 0;
`

interface SublineLinkProps {
  dark?: boolean
}

const SublineH2 = styled.h2`
  padding-left: 1.5rem;

  @media screen and (min-width: 18rem) {
    padding-left: 3.5rem;
  }

  @media screen and (max-width: 15rem) {
    padding-left: 0.5rem;
  }
`

const SublineLink = styled(Link)<SublineLinkProps>`
  color: ${props =>
    props.dark
      ? transparentizeColor('white', 0.6)
      : lightenColor('darkGray', 0.25)};
  font-weight: 500;
  font-size: 1.66rem;
  /* padding-left: 0.5rem; */
  /* display: block; */
  line-height: 1.4;
  letter-spacing: 0.04rem;
  text-decoration: none;

  &:hover {
    color: ${props => (props.dark ? '#fff' : getColor('brand'))};
  }
`

const Image = styled.img`
  width: 9rem;
  padding: 0.8rem 0 0 0.67rem;
`

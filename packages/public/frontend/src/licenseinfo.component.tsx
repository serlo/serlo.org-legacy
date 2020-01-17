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
import { lightenColor } from './provider.component'
import { Anchor } from 'grommet'
import SVG from 'react-inlinesvg'

interface LicenseInfoProps {
  title: string
  licenseURL: string
  infoURL: string
  symbolURL?: string
}

export default class LicenseInfo extends React.Component<LicenseInfoProps> {
  public render() {
    const { licenseURL, title, infoURL, symbolURL } = this.props
    return (
      <LicenseWrap>
        <Anchor href={licenseURL} rel="license nofollow">
          {title}
        </Anchor>
        , wenn nicht anders angeben.
        <br />
        Was das genau bedeutet erfährst du <Anchor href={infoURL}>hier</Anchor>.
        <br />
        {symbolURL && (
          <IconAnchor href={licenseURL}>
            <SVG src={symbolURL} />
          </IconAnchor>
        )}
      </LicenseWrap>
    )
  }
}

const LicenseWrap = styled.div`
  opacity: 0.8;
  padding: 0.5rem 0;
  margin-bottom: 2rem;
  border-top: 1px solid ${lightenColor('brand', 0.2)};
  color: ${lightenColor('brand', 0.2)};
  fill: ${lightenColor('brand', 0.2)};
`

const IconAnchor = styled(Anchor)`
  display: inline-block;
  margin-top: 0.6rem;
  &:hover {
    background: none;
    box-shadow: none;
  }
  span > svg {
    fill: ${lightenColor('brand', 0.2)};
    width: 6rem;
    height: auto;
  }
`

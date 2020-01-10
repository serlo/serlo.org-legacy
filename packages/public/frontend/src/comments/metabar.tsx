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
import { Box } from 'grommet'
import { Button, DropButton } from '../button.component'
import * as moment from 'moment'
import { getColor } from '../provider.component'

const renderItems = (leaf: boolean | undefined, timestamp: Date) => (
  <DropContent>
    {leaf ? null : (
      <DropContentButton
        label="Diskussion archivieren"
        iconName="faCheck"
        backgroundColor="transparent"
        activeBackgroundColor={getColor('lightblue')}
        fontColor={getColor('darkGray')}
      />
    )}
    <DropContentButton
      label="Diskussion melden"
      iconName="faFlag"
      backgroundColor="transparent"
      activeBackgroundColor={getColor('lightblue')}
      fontColor={getColor('darkGray')}
    />
    <DropContentButton
      label="Diskussion löschen"
      iconName="faTrash"
      backgroundColor="transparent"
      activeBackgroundColor={getColor('lightblue')}
      fontColor={getColor('darkGray')}
    />
    <Time>
      Gepostet am{' '}
      {'' +
        // @ts-ignore
        moment(timestamp)
          .locale('de')
          .format('DD.MM.YYYY, HH:mm:ss ')}
    </Time>
  </DropContent>
)

export default function MetaBar({
  author,
  timestamp,
  leaf
}: {
  author: any
  timestamp: Date
  leaf: boolean | undefined
}) {
  return (
    <MetaBarBox direction="row" justify="between">
      <BoldButton
        label={author.username}
        iconName="faUserGraduate"
        href={`https://serlo.org/${author.id}`}
        backgroundColor="transparent"
        activeBackgroundColor={getColor('lightblue')}
        fontColor={getColor('brand')}
      />
      <span>
        <StyledDropButton
          dropAlign={{ top: 'bottom', right: 'right' }}
          dropContent={renderItems(leaf, timestamp)}
          iconName="faCaretDown"
          fontColor={getColor('lighterblue')}
          activeFontColor={'#fff'}
          backgroundColor="transparent"
          activeBackgroundColor={getColor('lightblue')}
          reverse
          label={
            '' +
            // @ts-ignore
            moment(timestamp)
              .locale('de')
              .startOf()
              .fromNow()
          }
        />
      </span>
    </MetaBarBox>
  )
}

const Time = styled.span`
  font-size: 0.65rem;
  text-align: center;
  color: ${getColor('lighterblue')};
  margin-top: 1rem;
`

const BoldButton = styled(Button)`
  font-weight: bold;
`

const DropContent = styled(Box)`
  background-color: ${getColor('bluewhite')};
  padding: 1rem 0.5rem 0.5rem 0.5rem;
`

const DropContentButton = styled(Button)`
  margin-bottom: 0.2rem;
`

const MetaBarBox = styled(Box)`
  color: #222;
  margin-bottom: 0.3rem;
`

const StyledDropButton = styled(DropButton)`
  > svg {
    width: 1.3rem;
    height: 1.3rem;
  }
`

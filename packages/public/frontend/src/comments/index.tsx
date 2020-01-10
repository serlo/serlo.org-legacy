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
import { Heading } from '../heading.component'

import CommentForm, { SendProps } from './commentform'
import { Comment } from './comment'

import LazyLoad from 'react-lazy-load'

export function Comments({ data, onSendComment }: CommentsProps) {
  return (
    <React.Fragment>
      <CommentBox pad="medium" alignSelf="center">
        <Heading level={2} icon={'faQuestionCircle'}>
          Hast du eine Frage?
        </Heading>
        <CommentForm
          placeholder="Deine Frage oder Anregung …"
          parent_id=""
          onSendComment={onSendComment}
        />

        <Heading level={2} icon={'faComments'}>
          99 Kommentare
        </Heading>
        {/* todo: calculate amount of comments (and children) or get from server */}

        <div>
          {data
            ? data.map(comment => {
                return (
                  <Comment
                    key={comment.id}
                    {...comment}
                    onSendComment={onSendComment}
                  />
                )
              })
            : null}
        </div>
      </CommentBox>
    </React.Fragment>
  )
}

const CommentBox = styled(Box)`
  /* max-width: 40rem; */
`

interface CommentsProps {
  data: Comment[]
  entity?: Entity
  user?: User
  onSendComment: (props: SendProps) => void
}

// interface CommentProps extends Comment {
//   leaf?: boolean
//   onSendComment?: (props: SendProps) => void
// }

interface Comment {
  id: string
  author: User
  body: string
  children?: Comment[]
  timestamp: Date
  entity?: Entity
}

interface User {
  id: string
  username: string
}

interface Entity {
  id: string
  label: string
}

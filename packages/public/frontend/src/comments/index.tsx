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
          {data.length} {data.length === 1 ? 'Kommentar' : 'Kommentare'}
        </Heading>
        <div>
          {console.log(data)}
          {data
            ? data.map((comment, index) => {
                return (
                  <Comment
                    key={comment.id ? comment.id : index}
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
  onSendComment: (props: SendProps) => Promise<void>
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

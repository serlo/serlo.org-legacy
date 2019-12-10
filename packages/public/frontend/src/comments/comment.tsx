import * as React from 'react'
import { Box, Grid } from 'grommet'

import CommentForm, { SendProps } from './commentform'
import MetaBar from './metabar'

export function Comment({
  id,
  author,
  body,
  children,
  timestamp,
  leaf,
  entity,
  onSendComment
}: CommentProps) {
  return (
    <React.Fragment>
      <Grid
        rows={['auto', 'flex']}
        columns={['auto', 'flex']}
        areas={[
          { name: 'buttons', start: [0, 0], end: [0, 0] },
          { name: 'content', start: [1, 0], end: [1, 0] }
        ]}
      >
        <Box
          gridArea="content"
          pad={{
            vertical: 'xsmall',
            left: leaf ? '.7rem' : 'none'
          }}
          margin={{ top: leaf ? 'medium' : 'none', bottom: 'small' }}
          border={{
            side: 'left',
            color: leaf ? '#BFDEEF' : 'transparent',
            size: leaf ? 'large' : 'xsmall'
          }}
        >
          {entity !== undefined
            ? null
            : //(
              // <Text margin={{ bottom: 'small' }}>
              //   Zu{' '}
              //   <Anchor href={`https://serlo.org/${entity.id}`}>
              //     {entity.label}
              //   </Anchor>
              //   :
              // </Text>
              //)
              null}

          <MetaBar author={author} timestamp={timestamp} leaf={leaf} />
          {body}
          {children && !leaf
            ? children.map((comment, index) => {
                return (
                  <Comment
                    key={comment.id ? comment.id : index}
                    leaf
                    onSendComment={onSendComment}
                    {...comment}
                  />
                )
              })
            : null}
          {!leaf && id ? (
            <CommentForm
              placeholder="Deine Antwort …"
              reply
              parent_id={id}
              onSendComment={onSendComment}
            />
          ) : null}
        </Box>
      </Grid>
    </React.Fragment>
  )
}

interface CommentProps extends Comment {
  leaf?: boolean
  onSendComment?: (props: SendProps) => Promise<void>
}

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

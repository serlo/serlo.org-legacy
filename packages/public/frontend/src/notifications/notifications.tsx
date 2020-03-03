
import * as React from 'react'
import styled from 'styled-components'
import { Button, DropButton } from '../button.component'
import { getColor } from '../provider.component'
import { Box, Grid, Anchor } from 'grommet'

export function Notifications({
    author,
    body,
    timestamp
    }: NotificationsProbs) {
    return (
        <React.Fragment>
            <Grid
            rows={['full', 'flex']}
            columns={['auto', '150px']}
            areas={[
                { name: 'content', start: [0, 0], end: [0, 0] },
                { name: 'timestamp', start: [1, 0], end: [1, 0] }
            ]}
            >
                <Box
                    gridArea="content"
                    pad={{
                        vertical: 'xsmall'
                    }}
                    >
                    <BodyWrapper>
                        <Anchor
                            href={`https://serlo.org/${author.id}`}>{author.username}</Anchor>{' '}
                        <Body dangerouslySetInnerHTML={{__html: body}}></Body>
                    </BodyWrapper>
                </Box>

                <Box
                    gridArea="timestamp"
                    pad={{
                        vertical: 'xsmall'
                    }}
                    >
                    <TimestampText>{timestamp}</TimestampText>
                </Box>
            </Grid>
        </React.Fragment>
    );
}

export interface NotificationsProbs {
    author: User,
    body: string,
    timestamp: string
}

interface User {
  id: string
  username: string
}

const BoldButton = styled.a`
    color: ${getColor('helperblue')};
    text-decoration: none;
`

const TimestampText = styled.span`
    color: ${getColor('lighterblue')}
`

const BodyWrapper = styled.div`
    margin-right: 20px
`

const Body = styled.span`
    a {
        color: ${getColor('brand')};
        text-decoration: none;
    }
    a:hover {
        color: ${getColor('lightblue')};
    }
`
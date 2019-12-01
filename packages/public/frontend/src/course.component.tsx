import * as React from 'react'
import { getColor, lightenColor } from './provider.component'
import { Heading } from './heading.component'
import styled from 'styled-components'
import { Box } from 'grommet'
import { Button } from './button.component'
import Breakpoint from 'react-socks'
import { MacroLayout } from './macrolayout.component'

interface CourseProps {
  pages: string[]
  currentPage: number
  courseTitle: string
}

export const Course: React.FunctionComponent<CourseProps> = props => {
  // Layoutstrategie: Auf kleinen Bildschirmen Anzeige oberhalb
  // Auf größeren Bildschirmen links am Rand
  let [isExpanded, setExpanded] = React.useState(false)

  return (
    <React.Fragment>
      <Breakpoint md down>
        <CollapsedCourseOverview>
          <Box margin="large" justify="center">
            <OverviewTitle {...props} />
            {!isExpanded ? (
              <Button
                backgroundColor={getColor('lightblue')}
                alignSelf="start"
                label="Kursübersicht anzeigen"
                margin={{ top: 'medium', bottom: 'medium' }}
                iconName={'faBars'}
                onClick={() => {
                  setExpanded(true)
                }}
              />
            ) : (
              <CourseList {...props} />
            )}
          </Box>
        </CollapsedCourseOverview>
        <MacroLayout
          main={
            <Box justify="center" margin={{ left: 'large', right: 'large' }}>
              <CourseContent>
                <PageTitle {...props} /> {props.children}{' '}
                <NextButton {...props} />
              </CourseContent>
            </Box>
          }
        />
      </Breakpoint>
      <Breakpoint lg up>
        <MacroLayout
          nav={
            <Box margin="small">
              <CollapsedCourseOverview>
                <OverviewTitle {...props} />
                <Box margin="small" justify="start">
                  <CourseList {...props} />
                </Box>
              </CollapsedCourseOverview>
            </Box>
          }
          main={
            <Box margin="small">
              <div>
                <PageTitle {...props} />
                {props.children}
                <NextButton {...props} />
              </div>
            </Box>
          }
        />
      </Breakpoint>
    </React.Fragment>
  )
}

interface PageTitleProps {
  currentPage: number
  pages: string[]
}

const PageTitle = (props: PageTitleProps) => {
  return (
    <Heading level={1}>
      <HeadingNumber>{props.currentPage}.</HeadingNumber>{' '}
      {props.pages[props.currentPage - 1]}
    </Heading>
  )
}

interface OverviewTitleProps {
  courseTitle: string
}

const OverviewTitle = (props: OverviewTitleProps) => {
  return (
    <Heading level={3} icon={'faGraduationCap'}>
      {props.courseTitle}
    </Heading>
  )
}

interface NextButtonProps {
  currentPage: number
  pages: string[]
}

const NextButton = (props: NextButtonProps) => {
  return (
    <>
      <Breakpoint lg up>
        <div style={{ marginBottom: '-1.4rem', float: 'right' }}>
          {props.currentPage < props.pages.length ? (
            <>
              <span style={{ color: lightenColor('brand', 0.3) }}>
                {props.currentPage + 1}.{' '}
              </span>
              <span style={{ color: getColor('brand') }}>
                {props.pages[props.currentPage]}
              </span>
            </>
          ) : null}
        </div>
      </Breakpoint>
      <div style={{ marginTop: '2rem', float: 'right', clear: 'both' }}>
        <Button
          backgroundColor={getColor('brand')}
          reverse
          iconName={'faArrowCircleRight'}
          label="Weiter"
        />
      </div>
    </>
  )
}

const CollapsedCourseOverview = styled.div`
  background-color: ${getColor('lightBackground')};
  width: 100%;

  h3 {
    margin: 1.2em 0.3em 0;
    max-width: none;
  }
`

interface CourseListProps {
  pages: string[]
  currentPage: number
}

const CourseList = (props: CourseListProps) => {
  return (
    <StyledCourseList>
      {props.pages.map((title: string, index: number) => (
        <li
          key={index}
          className={index === props.currentPage - 1 ? 'active' : ''}
        >
          <a href="javascript:location.reload()">{title}</a>
        </li>
      ))}
    </StyledCourseList>
  )
}

const StyledCourseList = styled.ul`
  counter-reset: list-counter;
  list-style-type: none;

  li {
    &:before {
      content: counter(list-counter);
      counter-increment: list-counter;
      margin-left: -1.5em;
      position: absolute;
      color: ${lightenColor('brand', 0.3)};
    }

    padding: 0.3em 0;
  }

  li a {
    color: ${getColor('brand')};
  }

  a {
    text-decoration: none;
  }

  li.active a {
    color: black;
  }
`

const CourseContent = styled.div`
  h1 {
    margin: 0.3em 0 1em;
  }
`

const HeadingNumber = styled.span`
  color: ${getColor('lighterblue')};
`

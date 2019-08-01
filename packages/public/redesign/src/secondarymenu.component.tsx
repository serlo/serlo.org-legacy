import * as React from 'react'
import ScrollMenu from 'react-horizontal-scrolling-menu'
import styled from 'styled-components'
import { Heading } from './heading.component'
import { getColor } from './provider.component'

interface SecondaryMenuProps {
  entries: string[]
  selectedIndex: number
}

export const SecondaryMenu: React.FunctionComponent<
  SecondaryMenuProps
> = props => {
  return (
    <StyledScrollMenu>
      <ScrollMenu
        alignCenter={false}
        data={props.entries.map((name, i) => {
          return (
            <div
              key={name}
              className={i === props.selectedIndex ? 'active' : ''}
            >
              <Heading level={3}>{name}</Heading>
            </div>
          )
        })}
        selected={props.entries[props.selectedIndex]}
        scrollToSelected={true}
        onSelect={(x: string | number | null) => {
          alert(x)
        }}
        arrowRight={<StyledArrowRight />}
        arrowLeft={<StyledArrowLeft />}
        hideSingleArrow={true}
        transition={0.6}
        inertiaScrolling={true}
        inertiaScrollingSlowdown={0.25}
        useButtonRole={false}
      />
    </StyledScrollMenu>
  )
}

const StyledScrollMenu = styled.div`
  h3 {
    user-select: none;
    padding: 0 0.5rem;
    margin: 0.7rem 0;
    cursor: pointer;
  }

  .active > h3 {
    color: black;
  }

  .menu-wrapper--inner > div:not(:last-child) {
    border-right: 1px solid ${getColor('lighterblue')};
  }

  .menu-item-wrapper {
    outline: none;
  }

  a {
    text-decoration: none;
  }

  .scroll-menu-arrow--disabled {
    opacity: 0.1;
  }
`

const StyledArrowLeft = styled.div`
  width: 0;
  height: 0;
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;
  border-right: 10px solid ${getColor('lightblue')};
  margin-right: 0.2rem;
  margin-left: 0.05rem;
  transform: scale(0.7, 2);
`

const StyledArrowRight = styled.div`
  width: 0;
  height: 0;
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;
  border-left: 10px solid ${getColor('lightblue')};
  margin-left: 0.2rem;
  margin-right: 0.05rem;
  transform: scale(0.7, 2);
`

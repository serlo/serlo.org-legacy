import * as React from 'react'
import { useState, useRef } from 'react'
import styled from 'styled-components'
import { Icon } from '../icon.component'
import { getColor, lightenColor } from '../provider.component'

export interface Props {
  value?: string
}

export function SearchInput(props: Props) {
  const [focused, setFocused] = useState(false)
  const inputRef = useRef<any>(null)

  function onButtonClick(e: React.MouseEvent) {
    e.preventDefault()

    if (focused && inputRef.current.value.length > 0)
      alert('sending:' + inputRef.current.value)

    inputRef.current.focus()
  }

  return (
    <_Wrap id="searchform" name="searchform">
      <_Input
        type="text"
        name="searchtext"
        ref={inputRef}
        placeholder="Suche"
        aria-label="Suche"
        value={props.value}
        focused={focused}
        onFocus={() => {
          setFocused(true)
        }}
        onBlur={() => {
          setFocused(false)
        }}
      />
      <_Button
        onMouseDown={e => e.preventDefault()}
        onClick={onButtonClick}
        type="submit"
        focused={focused}
      >
        <Icon icon="faSearch" />
      </_Button>
    </_Wrap>
  )
}

const _Wrap = styled.form`
  background-color: ${lightenColor('lighterblue', 0.1)};
  width: 100%;
  display: flex;
  margin-top: 0;
  transition: background-color 0.4s ease;

  &:focus-within {
    background-color: ${getColor('lighterblue')};
  }

  @media (min-width: ${props => props.theme.sm}) {
    width: 7rem;
    position: absolute;
    top: 7.95rem;
    right: 2rem;
    background-color: transparent;
    border-radius: 1.1rem;
    height: 2.2rem;
    margin-top: 0;

    transition: all 0.4s ease;

    &:focus-within {
      width: 12rem;
      background-color: ${lightenColor('lighterblue', 0.1)};
    }
  }

  @media (min-width: ${props => props.theme.lg}) {
    right: 1.7rem;
    margin-top: -0.3rem;
    margin-left: auto;
  }
`

interface _ButtonProps {
  focused: boolean
}

const _Button = styled.button<_ButtonProps>`
  background-color: ${props =>
    props.focused ? getColor('brand') : lightenColor('lighterblue', 0.1)};
  transition: background-color 0.2s ease-in;
  min-width: 2.5rem;
  height: 2.5rem;
  border: 0;
  color: ${getColor('brand')};
  color: ${props => (props.focused ? '#fff' : getColor('brand'))};
  border-radius: 0;
  outline: none;
  cursor: pointer;

  &:hover {
    background-color: ${getColor('brand')};
    color: #fff;
  }

  @media (min-width: ${props => props.theme.sm}) {
    color: #fff;
    top: 0;
    padding: 0.1rem 0 0 0.1rem;
    min-width: 2.2rem;
    height: 2.2rem;
    border-radius: 1.1rem;
  }
`

interface _InputProps {
  focused: boolean
}

const _Input = styled.input<_InputProps>`
  color: ${getColor('brand')};
  font-weight: bold;
  width: calc(100% - 3rem);
  background-color: transparent;
  border: 0;
  /* height: 2.5rem; */
  padding-left: 3rem;
  outline: none;
  cursor: ${props => (props.focused ? 'auto' : 'pointer')};

  &::placeholder {
    color: ${getColor('brand')};
    outline: none;
  }

  &:focus::placeholder {
    opacity: 0;
  }

  @media (min-width: ${props => props.theme.sm}) {
    padding: 0 0 0 0.8rem;
    margin-top: -0.2rem;
    &::placeholder {
      color: ${getColor('lightblue')};
      text-align: right;
      padding-right: 1rem;
      margin-top: -0.1rem;
    }
  }
`

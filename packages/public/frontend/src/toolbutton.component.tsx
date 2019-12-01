import * as React from 'react'
import styled, { css } from 'styled-components'
import { Icon } from './icon.component'

import {
  Button as GrommetButton,
  DropButton as GrommetDropButton,
  ButtonProps as grommetButtonProps
} from 'grommet'

import { getColor, getDefaultTransition } from './provider.component'

export interface ButtonProps extends grommetButtonProps {
  title?: string
  iconName?: string
  size?: 0.8 | 1.0 | 1.1 | 1.2 | 2.0 | 2.5 | 3.0
  active?: boolean
  fontColor?: string
  iconColor?: string
  activeIconColor?: string
  backgroundColor?: string
  activeFontColor?: string
  activeBackgroundColor?: string
  className?: string
  dropAlign?: {
    top?: 'top' | 'bottom'
    bottom?: 'top' | 'bottom'
    right?: 'left' | 'right'
    left?: 'left' | 'right'
  }
  dropContent?: JSX.Element
  dropTarget?: object
  onOpen?: () => void
  onClose?: () => void
}

Button.defaultProps = {
  active: false,
  title: '',
  size: 1.0,
  backgroundColor: getColor('brandGreen'),
  activeBackgroundColor: getColor('brand'),
  activeFontColor: '#fff',
  fontColor: '#fff',
  as: GrommetButton
}

export function Button(props: ButtonProps) {
  return (
    <ButtonWrap size={props.size}>
      <StyledButton
        {...props}
        className={props.className}
        a11yTitle={props.title}
        plain
        as={props.as}
        icon={
          props.iconName ? (
            <StyledIcon
              iconColor={props.iconColor}
              activeIconColor={props.activeIconColor}
              active={props.active}
              label={props.label}
              icon={props.iconName}
            />
          ) : (
            undefined
          )
        }
      />
    </ButtonWrap>
  )
}

export function DropButton(props: ButtonProps) {
  return <Button {...{ ...props, as: GrommetDropButton }} />
}

const ButtonWrap = styled.div<ButtonProps>`
  display: inline-block;
  font-size: ${props => props.size + 'rem'};
`

const StyledButton = styled(GrommetButton)<ButtonProps>`
  font-size: 1em;

  display: block;
  border-radius: 5em;
  width: 2.5em;
  height: 2.5em;
  padding: 0;
  text-align: center;

  transition: ${getDefaultTransition()};

  color: ${props =>
    props.active && props.activeFontColor
      ? props.activeFontColor
      : props.fontColor};
  background-color: ${props =>
    props.active ? props.activeBackgroundColor : props.backgroundColor};

  box-shadow: none;

  &:hover,
  &:focus {
    color: ${props =>
      !props.active ? props.activeFontColor : props.fontColor};
    background-color: ${props =>
      !props.active ? props.activeBackgroundColor : props.backgroundColor};
  }

  &:focus {
    box-shadow: 0 0 4px 0 ${getColor('brand')};
  }

  ${props =>
    props.label &&
    css`
      width: auto;
      height: auto;
      padding: 0.2em 0.4em;
    `}
`

interface StyledIconProps {
  iconColor?: string
  activeIconColor?: string
  active?: boolean
  [propName: string]: any
}
// iconColor = { props.iconColor }
// activeIconColor = { props.activeIconColor }
// active = { props.active }
// label = { props.label }
// iconName = { props.iconName }

const StyledIcon = styled(Icon)<StyledIconProps>`
  width: 1.5em !important;
  height: 1.5em !important;
  vertical-align: -0.4em;

  color: ${props => (props.active ? props.activeIconColor : props.iconColor)};

  ${StyledButton}:hover & {
    color: ${props =>
      !props.active ? props.activeIconColor : props.iconColor};
  }

  ${props =>
    props.label &&
    css`
      width: 0.9em !important;
      height: 0.9em !important;
      vertical-align: -0.6em;
    `}
`

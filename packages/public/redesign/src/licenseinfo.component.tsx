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

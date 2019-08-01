import * as React from 'react'

interface ContentWrapperProps {
  dummyContent: string
}

export class ContentWrapper extends React.Component<ContentWrapperProps, {}> {
  public render() {
    return <div dangerouslySetInnerHTML={{ __html: this.props.dummyContent }} />
  }
}

import Document, { Html, Head, Main, NextScript } from 'next/document'
import { ServerStyleSheet } from 'styled-components'

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const sheet = new ServerStyleSheet()
    const originalRenderPage = ctx.renderPage

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: App => props => sheet.collectStyles(<App {...props} />)
        })

      const initialProps = await Document.getInitialProps(ctx)
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        )
      }
    } finally {
      sheet.seal()
    }
  }

  render() {
    if (this.props.dangerousAsPath.startsWith('/__')) {
      // render partial
      return (
        <>
          <MyScripts />
          <Main />
          <NextScript />
        </>
      )
    } else {
      // render normal
      return (
        <Html>
          <Head />
          <body>
            <Main />
            <NextScript />
          </body>
        </Html>
      )
    }
  }
}

class MyScripts extends Head {
  render() {
    return (
      <>
        {this.props.children}
        {this.getCssLinks()}
        {this.context._documentProps.styles || null}
      </>
    )
  }
}

import Document, { Head, Html, Main, NextScript } from 'next/document'
import { ServerStyleSheet } from 'styled-components'

import * as bodyParser from 'body-parser'

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
          <MyMain />
          <MyNextScript />
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

export async function handleBody(req, res, defaultProps) {
  const props = defaultProps
  if (req && res) {
    await new Promise(resolve => {
      bodyParser.json()(req, res, resolve)
    })
    const json = req.body
    // requiring valid key
    if (
      process.env.ATHENE_NEXTJS_KEY &&
      json.key === process.env.ATHENE_NEXTJS_KEY
    ) {
      for (let key in defaultProps) {
        if (json[key]) {
          // @ts-ignore
          defaultProps[key] = json[key]
        }
      }
    }
  }
  return props
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

class MyMain extends Main {
  render() {
    const { inAmpMode, html } = this.context._documentProps
    if (inAmpMode) return '__NEXT_AMP_RENDER_TARGET__'
    // supporting multiroot in production, append page to id of react root
    return (
      <div
        className="__next"
        id={`__next${
          process.env.NODE_ENV === 'production'
            ? this.context._documentProps.__NEXT_DATA__.page
            : ''
        }`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    )
  }
}

class MyNextScript extends NextScript {
  render() {
    const {
      staticMarkup,
      assetPrefix,
      inAmpMode,
      devFiles,
      files,
      __NEXT_DATA__
    } = this.context._documentProps

    const { page, buildId } = __NEXT_DATA__

    if (
      !inAmpMode &&
      process.env.NODE_ENV === 'production' &&
      !staticMarkup &&
      (!devFiles || devFiles.length === 0) &&
      page !== '/_error' &&
      this.getDynamicChunks().length === 0 &&
      !(this.props.crossOrigin || process.crossOrigin) &&
      !this.props.nonce &&
      page !== '/' &&
      buildId
    ) {
      // we are in production, adding page to data-tag
      // making sure resources don't get loaded twice
      return (
        <>
          <script
            id={'__NEXT_DATA__' + page}
            type="application/json"
            dangerouslySetInnerHTML={{
              __html: NextScript.getInlineScriptSource(
                this.context._documentProps
              )
            }}
          />
          <script
            async
            key={page}
            src={assetPrefix + `/_next/static/${buildId}/pages${page}.js`}
          />
          <script
            key={'mulitroots'}
            dangerouslySetInnerHTML={{
              __html: `
                if (!window.NEXT_ROOTS) window.NEXT_ROOTS = []
                window.NEXT_ROOTS.push("${page}")
            `
            }}
          />
          {createDedupScriptTag(
            assetPrefix + `/_next/static/${buildId}/pages/_app.js`
          )}
          {files &&
            files.length > 0 &&
            files.map(file => {
              if (!/\.js$/.exec(file)) {
                return null
              }
              return createDedupScriptTag(`${assetPrefix}/_next/${file}`, file)
            })}
        </>
      )
    }

    return NextScript.prototype.render.call(this)
  }
}

function createDedupScriptTag(path, key) {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          if (!window.NEXTJS_SCRIPT_CACHE) window.NEXTJS_SCRIPT_CACHE = {}
          var cache = window.NEXTJS_SCRIPT_CACHE
          if (!cache["${key}"]) {
            var script = document.createElement("script");
            script.src ="${path}";
            document.head.appendChild(script);
            cache["${key}"] = true
          }
        `
      }}
      key={key}
    />
  )
}

import Document, { Head, Html, Main, NextScript } from 'next/document'
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
  if (typeof window === 'undefined' && req && res) {
    const bodyParser = await import('body-parser')
    await new Promise(resolve => {
      bodyParser.json()(req, res, resolve)
    })
    const json = req.body
    for (let key in defaultProps) {
      if (json[key]) {
        // @ts-ignore
        defaultProps[key] = json[key]
      }
    }
    props.assetPrefix = process.env.ASSET_PREFIX || ''
    props.nextAssetPrefix = process.env.NEXT_ASSET_PREFIX || ''
    const shortid = await import('shortid')
    props.componentID = shortid.generate()
  }
  return props
}

class MyScripts extends Head {
  render() {
    return (
      <>
        {this.props.children}
        {this.myGetCssLinks()}
        {this.context._documentProps.styles || null}
      </>
    )
  }

  myGetCssLinks() {
    const { files } = this.context._documentProps
    const assetPrefix = process.env.NEXT_ASSET_PREFIX || ''
    const cssFiles =
      files && files.length ? files.filter(f => /\.css$/.test(f)) : []

    return cssFiles.length === 0
      ? null
      : cssFiles.map(file => (
          <link
            key={file}
            nonce={this.props.nonce}
            rel="stylesheet"
            href={`${assetPrefix}/_next/${encodeURI(file)}`}
            crossOrigin={this.props.crossOrigin || process.crossOrigin}
          />
        ))
  }
}

class MyMain extends Main {
  render() {
    const { inAmpMode, html, __NEXT_DATA__ } = this.context._documentProps
    if (inAmpMode) return '__NEXT_AMP_RENDER_TARGET__'
    // supporting multiroot in production, append page to id of react root
    return (
      <div
        className="__next"
        id={`__next${__NEXT_DATA__.page}#${__NEXT_DATA__.props.pageProps.componentID}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    )
  }
}

class MyNextScript extends NextScript {
  render() {
    let {
      staticMarkup,
      inAmpMode,
      devFiles,
      files,
      __NEXT_DATA__
    } = this.context._documentProps
    const assetPrefix = process.env.NEXT_ASSET_PREFIX
    const { page, buildId, props } = __NEXT_DATA__

    if (
      !inAmpMode &&
      !staticMarkup &&
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
            id={'__NEXT_DATA__' + page + '#' + props.pageProps.componentID}
            type="application/json"
            dangerouslySetInnerHTML={{
              __html: NextScript.getInlineScriptSource(
                this.context._documentProps
              )
            }}
          />
          <script
            defer
            key={page}
            src={assetPrefix + `/_next/static/${buildId}/pages${page}.js`}
          />
          <script
            key={'mulitroots'}
            dangerouslySetInnerHTML={{
              __html: `
                if (!window.NEXT_ROOTS) window.NEXT_ROOTS = []
                window.NEXT_ROOTS.push("${page}#${props.pageProps.componentID}")
            `
            }}
          />
          {createDedupScriptTag(
            assetPrefix + `/_next/static/${buildId}/pages/_app.js`,
            '--_app.js--'
          )}
          {files &&
            files.length > 0 &&
            files.map(file => {
              if (!/\.js$/.exec(file)) {
                return null
              }
              return createDedupScriptTag(`${assetPrefix}/_next/${file}`, file)
            })}
          {devFiles &&
            devFiles.length > 0 &&
            devFiles.map(file => {
              if (!/\.js$/.exec(file)) {
                return null
              }
              return (
                <script
                  src={`${assetPrefix}/_next/${file}`}
                  key={file}
                ></script>
              )
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
            script.setAttribute("defer", "");
            document.head.appendChild(script);
            cache["${key}"] = true
          }
        `
      }}
      key={key}
    />
  )
}

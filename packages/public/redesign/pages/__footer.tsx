import { Provider, GlobalStyle } from '../src/provider.component'
import { Normalize } from 'styled-normalize'

import { footerNavEntries, serloSlogan } from '../__stories__/dummycontent'

import { Footer } from '../src/footer'

import '@fortawesome/fontawesome-svg-core/styles.css'
import { config } from '@fortawesome/fontawesome-svg-core'
// Prevent fontawesome from dynamically adding its css since we did it manually above
config.autoAddCss = false

export default function Index(props: any) {
  return (
    <Provider>
      <Normalize />
      <GlobalStyle />

      <Footer navEntries={props.footerNavEntries} slogan={props.serloSlogan} />
    </Provider>
  )
}
Index.getInitialProps = async ({ req }: {req:any}) => {
  if (req) {
    // read req body and parse json EXAMPLE
    /*let data:any = await new Promise(res => {
      let data:any = []
      req.on('data', (chunk:any) => {
        data.push(chunk)
      })
      req.on('end', () => {
        res(JSON.parse(data))
      })
    })
    console.log(data)*/
    // use it with:
    // curl -X POST -H 'Content-Type: application/json' -d '{"name": "New item", "year": "2009"}' localhost:3000/__footer
    
    
    
    // the server can access request object and extract props
    const urlparams = new URLSearchParams(req.url.replace("/__footer?",""))
    return { footerNavEntries, serloSlogan:urlparams.has("slogan")?urlparams.get("slogan"):serloSlogan    }
  }
  return null
}
import { storiesOf } from '@storybook/react'
import * as React from 'react'

import { Editor } from '../src/editor'

const ccBy = {
  agreement:
    'Mit dem Speichern dieser Seite versicherst du, dass du deinen Beitrag (damit sind auch Änderungen gemeint) selbst verfasst hast bzw. dass er keine fremden Rechte verletzt. Du willigst ein, deinen Beitrag unter der <a href="http://creativecommons.org/licenses/by-sa/4.0/">Creative Commons Attribution/Share-Alike Lizenz 4.0</a> (http://creativecommons.org/licenses/by-sa/4.0/) und/oder unter einer gleichwertigen Lizenz zu veröffentlichen, welche die Gesellschaft für freie Bildung e. V. entsprechend der Regelungen in den <a href="/21654">Nutzungsbedingungen</a> (http://de.serlo.org/21654) festlegen darf. Falls du den Beitrag nicht selbst verfasst hast, muss er unter den <a href="/21654">Nutzungsbedingungen</a> (http://de.serlo.org/21654) verfügbar sein und du stimmst zu, notwendigen Lizenzanforderungen zu folgen.',
  iconHref: 'https://i.creativecommons.org/l/by-sa/4.0/88x31.png',
  id: 1,
  title: 'Dieses Werk steht unter der freien Lizenz cc-by-sa-4.0',
  url: 'https://creativecommons.org/licenses/by-sa/4.0/'
}

storiesOf('Editor', module).add('Article', () => {
  const initialState = {
    id: 1337,
    license: ccBy,
    changes: '',
    title: 'Title',
    content: '',
    reasoning: '',
    meta_title: '',
    meta_description: ''
  }
  return (
    <React.Fragment>
      <div className="controls" />
      <Editor type="article" initialState={initialState} />
    </React.Fragment>
  )
})

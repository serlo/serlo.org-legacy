import * as React from 'react'
import { StatefulPlugin, StatefulPluginEditorProps, StateType } from '@edtr-io/core'
import { Overlay, OverlayInput, Textarea, EditorInput,  } from '@edtr-io/editor-ui'
import { legacyOrChild, licenseState } from './common'


export const articleState = StateType.object({
  id: StateType.number(),
  title: StateType.string(),
  content: legacyOrChild,
  // reasoning: legacyOrChild,
  // changes: StateType.string(),
  // metaTitle: StateType.string(),
  // metaDescription: StateType.string(),
  license: licenseState
})

export const articlePlugin: StatefulPlugin<typeof articleState> = {
  Component: ArticleRenderer,
  state: articleState
}

function ArticleRenderer(props: StatefulPluginEditorProps<typeof articleState>) {
  // const { title, content, reasoning, changes, metaTitle, metaDescription, license } = props.state
  const { title, content } = props.state


  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    title.set(e.target.value)
  }

  // function handleMetaTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
  //   metaTitle.set(e.target.value)
  // }
  // function handleMetaDescriptionChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
  //   metaDescription.set(e.target.value)
  // }
  function handleLicenseChange(e: React.ChangeEvent<HTMLInputElement>) {
    //TODO
  }
  return (
    <article>
      <div className="page-header">
        <h1>{ props.editable ? <EditorInput placeholder="Titel" value={title.value} onChange={handleTitleChange}/> : <span itemProp="name">{ title.value }</span> } </h1>
      </div>
      <div itemProp="articleBody">
        { content.render() }
      </div>
      {/*{ props.editable*/}
      {/*  ? (*/}
      {/*    <React.Fragment>*/}
      {/*      { reasoning.render() }*/}
      {/*      <Overlay>*/}
      {/*        <OverlayInput*/}
      {/*          label="Suchmaschinen-Titel"*/}
      {/*          placeholder="Ein Titel für die Suchmaschine. Standardwert: der Titel"*/}
      {/*          value={metaTitle.value}*/}
      {/*          onChange={handleMetaTitleChange}*/}
      {/*        />*/}
      {/*        <Textarea*/}
      {/*          label="Suchmaschinen-Beschreibung"*/}
      {/*          placeholder="Gib hier eine Beschreibung für die Suchmaschine ein (ca. 160 Zeichen). Standardwert: Der Anfang des Artikels"*/}
      {/*          value={metaDescription.value}*/}
      {/*          onChange={handleMetaDescriptionChange}*/}
      {/*        />*/}
      {/*        <OverlayInput*/}
      {/*          label="Lizenz"*/}
      {/*          value={metaTitle.value}*/}
      {/*          disabled={true}*/}
      {/*          onChange={handleLicenseChange}*/}
      {/*        />*/}
      {/*      </Overlay>*/}
      {/*    </React.Fragment>*/}
      {/*  ) : null*/}
      {/*}*/}
    </article>
  )
}
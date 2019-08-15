import * as React from 'react'
import { ScopeContext, useStore, actions, selectors, StatefulPlugin, StatefulPluginEditorProps, StateType } from '@edtr-io/core'
import { Overlay, OverlayInput, Textarea, EditorInput,  } from '@edtr-io/editor-ui'
import { standardElements, SaveButton, editorContent } from './common'


export const articleState = StateType.object({
  ...standardElements,
  title: StateType.string(),
  content: editorContent(),
  reasoning: editorContent(),
  meta_title: StateType.string(),
  meta_description: StateType.string(),
})

export const articlePlugin: StatefulPlugin<typeof articleState> = {
  Component: ArticleRenderer,
  state: articleState
}

function ArticleRenderer(props: StatefulPluginEditorProps<typeof articleState>) {
  const { title, content, reasoning, changes, meta_title, meta_description, license } = props.state

  const { scope } = React.useContext(ScopeContext)

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    title.set(e.target.value)
  }

  function handleMetaTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    meta_title.set(e.target.value)
  }
  function handleMetaDescriptionChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    meta_description.set(e.target.value)
  }
  function handleLicenseChange(e: React.ChangeEvent<HTMLInputElement>) {
    //TODO
  }

  console.log('state', props.state.content())

  return (
    <article>
      <div className="page-header">
        <h1>{ props.editable ? <EditorInput placeholder="Titel" value={title.value} onChange={handleTitleChange}/> : <span itemProp="name">{ title.value }</span> } </h1>
      </div>
      <div itemProp="articleBody">
        { content.render() }
      </div>
      { props.editable && props.focused
        ? (
          <React.Fragment>
            { reasoning.render() }
            <Overlay>
              <OverlayInput
                label="Suchmaschinen-Titel"
                placeholder="Ein Titel für die Suchmaschine. Standardwert: der Titel"
                value={meta_title.value}
                onChange={handleMetaTitleChange}
              />
              <Textarea
                label="Suchmaschinen-Beschreibung"
                placeholder="Gib hier eine Beschreibung für die Suchmaschine ein (ca. 160 Zeichen). Standardwert: Der Anfang des Artikels"
                value={meta_description.value}
                onChange={handleMetaDescriptionChange}
              />
              <OverlayInput
                label="Lizenz"
                value={license.id.value}
                disabled={true}
                onChange={handleLicenseChange}
              />
            </Overlay>
          </React.Fragment>
        ) : null
      }
      <SaveButton scope={scope}/>
    </article>
  )
}
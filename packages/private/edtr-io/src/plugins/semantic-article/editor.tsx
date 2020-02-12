import * as React from 'react'
import { SemanticArticlePorps } from '.'
import {
  useHasFocusSelector,
  SemanticArticleTypes,
  Content,
  Controls,
  ControlButton,
  Overlay,
  articleIntroductionGuideline,
  articleExplanationGuideline,
  articleExampleGuideline,
  articleExtraGuideline,
  articleVideoGuideline
} from '../semantic-plugin-helpers'
import { SemanticArticleRenderer } from './renderer'
import { useScopedSelector } from '@edtr-io/core'
import { getFocusPath } from '@edtr-io/store'
import { Icon, faTrashAlt } from '@edtr-io/ui'
import { faQuestion } from '@fortawesome/free-solid-svg-icons/faQuestion'
import { AddButton } from '@edtr-io/editor-ui'

export function SemanticArticleEditor(props: SemanticArticlePorps) {
  const { state, editable } = props
  const pluginFocused = useHasFocusSelector(props.id)
  const focusPath = useScopedSelector(getFocusPath())
  const [introductionHelpVisible, setIntroductionHelp] = React.useState(false)
  const [explanationHelpVisible, setExplanationHelp] = React.useState(false)
  const [exampleHelpVisible, setExampleHelp] = React.useState(false)
  const [extraHelpVisible, setExtraHelp] = React.useState(false)
  const [videoHelpVisible, setVideoHelp] = React.useState(false)

  return editable && pluginFocused ? (
    <React.Fragment>
      <Content type={SemanticArticleTypes.introduction}>
        {state.introduction.render()}
      </Content>
      <Controls
        show={(focusPath && focusPath.includes(state.introduction.id)) || false}
      >
        <ControlButton
          onMouseDown={() => {
            setIntroductionHelp(true)
          }}
        >
          <Icon icon={faQuestion} />
        </ControlButton>
      </Controls>
      <Overlay
        content={articleIntroductionGuideline}
        open={introductionHelpVisible}
        setOpen={setIntroductionHelp}
      />

      <Content type={SemanticArticleTypes.explanation}>
        {state.explanation.render()}
      </Content>
      <Controls
        show={(focusPath && focusPath.includes(state.explanation.id)) || false}
      >
        <ControlButton
          onMouseDown={() => {
            setExplanationHelp(true)
          }}
        >
          <Icon icon={faQuestion} />
        </ControlButton>
      </Controls>
      <Overlay
        content={articleExplanationGuideline}
        open={explanationHelpVisible}
        setOpen={setExplanationHelp}
      />
      {state.example.defined ? (
        <div style={{ position: 'relative' }}>
          {state.example.render()}
          <Controls
            show={(focusPath && focusPath.includes(state.example.id)) || false}
          >
            <ControlButton
              onMouseDown={() => {
                state.example.defined ? state.example.remove() : null
              }}
            >
              <Icon icon={faTrashAlt} />
            </ControlButton>
            <ControlButton
              onMouseDown={() => {
                setExampleHelp(true)
              }}
            >
              <Icon icon={faQuestion} />
            </ControlButton>
          </Controls>
          <Overlay
            content={articleExampleGuideline}
            open={exampleHelpVisible}
            setOpen={setExampleHelp}
          />
          {/* TODO: Plugin, das einen Text und einen Link akzeptiert? */}
        </div>
      ) : (
        <AddButton
          title={'Eine repräsentative Aufgabe'}
          onClick={() => {
            state.example.defined ? null : state.example.create()
          }}
        >
          Beispielaufgabe hinzufügen
        </AddButton>
      )}
      {state.extra.defined ? (
        <div style={{ position: 'relative' }}>
          {state.extra.render()}
          <Controls
            show={(focusPath && focusPath.includes(state.extra.id)) || false}
          >
            <ControlButton
              onMouseDown={() => {
                state.extra.defined ? state.extra.remove() : null
              }}
            >
              <Icon icon={faTrashAlt} />
            </ControlButton>
            <ControlButton
              onMouseDown={() => {
                setExtraHelp(true)
              }}
            >
              <Icon icon={faQuestion} />
            </ControlButton>
          </Controls>
          <Overlay
            content={articleExtraGuideline}
            open={extraHelpVisible}
            setOpen={setExtraHelp}
          />
        </div>
      ) : (
        <AddButton
          title={'Vertiefungen oder Ergänzungen'}
          onClick={() => {
            state.extra.defined ? null : state.extra.create()
          }}
        >
          Vertiefung hinzufügen
        </AddButton>
      )}
      {state.videoUrl.defined ? (
        <div style={{ position: 'relative' }}>
          {state.videoUrl.render()}
          <Controls
            show={(focusPath && focusPath.includes(state.videoUrl.id)) || false}
          >
            <ControlButton
              onMouseDown={() => {
                state.videoUrl.defined ? state.videoUrl.remove() : null
              }}
            >
              <Icon icon={faTrashAlt} />
            </ControlButton>
            <ControlButton
              onMouseDown={() => {
                setVideoHelp(true)
              }}
            >
              <Icon icon={faQuestion} />
            </ControlButton>
          </Controls>
          <Overlay
            content={articleVideoGuideline}
            open={videoHelpVisible}
            setOpen={setVideoHelp}
          />
        </div>
      ) : (
        <AddButton
          title={'Ergänzendes Video'}
          onClick={() => {
            state.videoUrl.defined ? null : state.videoUrl.create()
          }}
        >
          Video hinzufügen
        </AddButton>
      )}
    </React.Fragment>
  ) : (
    <SemanticArticleRenderer {...props} />
  )
}

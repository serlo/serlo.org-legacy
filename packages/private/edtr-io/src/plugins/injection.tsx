/**
 * This file is part of Serlo.org.
 *
 * Copyright (c) 2013-2019 Serlo Education e.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @copyright Copyright (c) 2013-2019 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/serlo.org for the canonical source repository
 */
import axios from 'axios'
import {
  OverlayInput,
  PrimarySettings,
  EditorInput,
  PreviewOverlay,
  styled,
  createIcon,
  Icon,
  faNewspaper
} from '@edtr-io/editor-ui'
import {
  StatefulPluginEditorProps,
  string,
  StatefulPlugin
} from '@edtr-io/plugin'
import * as React from 'react'

/* global */
declare const Common: {
  trigger: (type: string, context?: HTMLDivElement | null) => void
}

export const injectionState = string()
export const injectionPlugin: StatefulPlugin<typeof injectionState> = {
  Component: InjectionEditor,
  state: injectionState,
  title: 'Serlo Inhalt',
  description: 'Binde einen Inhalt von serlo.org via ID ein',
  icon: createIcon(faNewspaper)
}

export function InjectionRenderer(props: { src: string }) {
  const [loaded, setLoaded] = React.useState('')
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const src = createURL(props.src)

    axios
      .get<{ response: string }>(src, {
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        }
      })
      .then(({ data }) => {
        setLoaded(data.response)
        setTimeout(() => {
          if (ref.current) {
            Common.trigger('new context', ref.current)
          }
        })
      })
      .catch(e => {
        setLoaded(
          '<div class="alert alert-info">Illegal injection found </div>'
        )
      })
  }, [props.src])

  if (loaded) {
    return (
      <div className="panel panel-default">
        <div
          className="panel-body"
          ref={ref}
          dangerouslySetInnerHTML={{ __html: loaded }}
        />
      </div>
    )
  }

  const src = createURL(props.src)
  return (
    <div>
      <a href={src}>Serlo Inhalt {src}</a>
    </div>
  )
}

function createURL(id: string) {
  if (id.startsWith('/') || id.startsWith('\\')) {
    return '/' + id.substring(1, id.length)
  }
  const match = id.match(/^https?:\/\/[^./]+\.serlo\.[^./]+\/(.+)$/g)
  if (match) {
    return '/' + match[1]
  }
  return '/' + id
}

const PlaceholderWrapper = styled.div({
  position: 'relative',
  width: '100%',
  textAlign: 'center'
})

function InjectionEditor(
  props: StatefulPluginEditorProps<typeof injectionState> & {
    renderIntoExtendedSettings?: (children: React.ReactNode) => React.ReactNode
  }
) {
  const [cache, setCache] = React.useState(props.state.value)
  const [preview, setPreview] = React.useState(false)

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setCache(props.state.value)
    }, 2000)
    return () => {
      clearTimeout(timeout)
    }
  }, [props.focused, props.state.value])

  if (!props.editable) {
    return <InjectionRenderer src={props.state.value} />
  }

  return (
    <React.Fragment>
      {cache ? (
        <PreviewOverlay
          focused={props.focused || false}
          onChange={nextActive => {
            setPreview(nextActive)
            if (nextActive) {
              setCache(props.state.value)
            }
          }}
        >
          <InjectionRenderer src={cache} />
        </PreviewOverlay>
      ) : (
        <PlaceholderWrapper>
          <Icon icon={faNewspaper} size="5x" />
        </PlaceholderWrapper>
      )}
      {props.focused && !preview ? (
        <PrimarySettings>
          {/*
           // @ts-ignore */}
          <EditorInput
            label="Serlo ID:"
            placeholder="123456"
            value={props.state.value}
            onChange={e => {
              props.state.set(e.target.value)
            }}
            textfieldWidth="30%"
            editorInputWidth="100%"
            ref={props.defaultFocusRef}
          />
        </PrimarySettings>
      ) : null}
      {props.renderIntoExtendedSettings
        ? props.renderIntoExtendedSettings(
            <React.Fragment>
              {/*
               // @ts-ignore */}
              <OverlayInput
                label="Serlo ID:"
                placeholder="123456"
                value={props.state.value}
                onChange={e => {
                  props.state.set(e.target.value)
                }}
              />
            </React.Fragment>
          )
        : null}
    </React.Fragment>
  )
}

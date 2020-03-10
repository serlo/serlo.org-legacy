import * as React from 'react'
// @ts-ignore
import Plain from 'slate-plain-serializer'
// @ts-ignore
import { Editor } from 'slate-react'

export function InlineInput(props: {
  onChange: (value: string) => void
  value: string
  placeholder: string
}) {
  const { onChange, value, placeholder } = props
  const [state, setState] = React.useState(Plain.deserialize(value))
  React.useEffect(() => {
    if (Plain.serialize(state) !== value) {
      setState(Plain.deserialize(value))
    }
  }, [value])

  return (
    <Editor
      placeholder={placeholder}
      value={state}
      onChange={({ value }: any) => {
        setState(value)
        onChange(Plain.serialize(value))
      }}
    />
  )
}

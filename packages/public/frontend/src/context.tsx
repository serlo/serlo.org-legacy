import * as React from 'react'

export const UserContext = React.createContext({
  user: { id: '', username: '' }
})

export const EntityContext = React.createContext({
  entity: { id: '', label: '' }
})

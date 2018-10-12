export const initEntityEditor = (...args: unknown[]) => {
  // @ts-ignore
  return import('./entity-editor').then(({ EntityEditor }) => {
    new EntityEditor(...args)
  })
}

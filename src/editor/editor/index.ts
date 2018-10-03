export const initEntityEditor = (...args: unknown[]) => {
  // prettier-ignore
  return import(
    /* webpackMode: "lazy-once" */
    // @ts-ignore FIXME:
    './entity-editor'
  ).then(({ EntityEditor }) => {
    new EntityEditor(...args)
  })
}

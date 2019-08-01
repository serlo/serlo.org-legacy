declare module 'react-socks' {
  export default React.Component;
  export class BreakpointProvider extends React.Component {}

  export interface BreakpointDefinition {
    [index: string]: number
  }
  export function setDefaultBreakpoints(defs: BreakpointDefinition[]) : void
}

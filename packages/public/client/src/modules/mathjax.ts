export function reprocess(context?: unknown) {
  command('Reprocess', context)
}

export function typeset(context?: unknown) {
  command('Typeset', context)
}

export function queue(args: unknown) {
  const { MathJax } = window as { MathJax?: any }
  if (MathJax) {
    MathJax.Hub.Queue(args)
  }
}

function command(command: string, context?: unknown) {
  const { MathJax } = window as { MathJax?: any }
  if (MathJax) {
    MathJax.Hub.Queue([command, MathJax.Hub, ...(context ? [context] : [])])
  }
}

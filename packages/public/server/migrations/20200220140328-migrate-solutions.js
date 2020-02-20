/**
 * Migrates the Edtr.io states of all entities of type `text-solution`.
 * THIS IS AN IRREVERSIBLE MIGRATION!
 */
exports.up = function(db, cb) {
  db.all(
    `
      SELECT erf.id, erf.value
      FROM entity_revision_field erf
        LEFT JOIN entity_revision er on erf.entity_revision_id = er.id
        LEFT JOIN entity e on er.repository_id = e.id
      WHERE erf.field = 'content'
        AND erf.value LIKE '{"plugin"%'
        AND e.type_id = (SELECT id FROM type WHERE name = 'text-solution')
    `,
    (err, results) => {
      if (err) {
        return cb(err)
      }
      processResults(results, cb)
    }
  )

  function processResults(results, cb) {
    if (results.length === 0) {
      return cb()
    }

    const [field, ...remainingResults] = results
    const state = JSON.parse(field.value)
    db.runSql(
      `UPDATE entity_revision_field SET value = ? WHERE id = ?`,
      [JSON.stringify(migrateState(state)), field.id],
      err => {
        if (err) {
          return cb(err)
        }
        processResults(remainingResults, cb)
      }
    )
  }
}

exports.down = function(db, cb) {
  cb()
}

exports._meta = {
  version: 1
}

function migrateState(state) {
  const stepsState = state.state.map(({ state }) => {
    const children = []
    const { introduction, strategy, solutionSteps, additionals } = state
    if (introduction && introduction.plugin === 'rows') {
      children.push(...introduction.state)
    }
    if (introduction && introduction.plugin === 'text') {
      children.push(introduction)
    }
    if (strategy && strategy.plugin === 'rows') {
      children.push(...strategy.state)
    }
    solutionSteps.forEach(step => {
      if (step.content && step.content.plugin === 'rows') {
        children.push(...step.content.state)
      }
    })
    if (additionals && additionals.plugin === 'rows') {
      children.push(...additionals.state)
    }
    return children
  })

  return {
    plugin: 'solution',
    state: {
      prerequisite: undefined,
      strategy: {
        plugin: 'text'
      },
      steps: {
        plugin: 'rows',
        state: [].concat(...stepsState)
      }
    }
  }
}

exports.migrateState = migrateState

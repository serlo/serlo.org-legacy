/**
 * Removes all entities of type `text-hint` from the database.
 * THIS IS A DESTRUCTIVE MIGRATION!
 */
exports.up = function(db, cb) {
  db.all("SELECT id FROM type WHERE name = 'text-hint'", (err, results) => {
    if (err) {
      console.log(err)
      return
    }
    if (results.length !== 1) {
      console.log('Expected type `text-hint` to exist')
      return
    }
    const { id } = results[0]
    db.runSql(
      `DELETE FROM uuid WHERE id = ANY(SELECT id FROM entity WHERE type_id = ?)`,
      id,
      cb
    )
  })
}

exports.down = function() {
  return null
}

exports._meta = {
  version: 1
}

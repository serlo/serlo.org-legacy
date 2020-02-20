/**
 * Removes all entities of type `text-hint` from the database.
 * THIS IS AN IRREVERSIBLE MIGRATION!
 */
exports.up = function(db, cb) {
  db.all("SELECT id FROM type WHERE name = 'text-hint'", (err, results) => {
    if (err) {
      return cb(err)
    }
    if (results.length !== 1) {
      return cb(new Error('Expected type `text-hint` to exist'))
    }

    const { id } = results[0]
    db.runSql(
      `DELETE FROM uuid WHERE id = ANY (SELECT id FROM entity WHERE type_id = ?)`,
      id,
      cb
    )
  })
}

exports.down = function(db, cb) {
  cb()
}

exports._meta = {
  version: 1
}

/**
 * Removes type `text-hint` from the database.
 */
exports.up = function(db, cb) {
  db.runSql("DELETE FROM type WHERE name = 'text-hint'", cb)
}

exports.down = function(db, cb) {
  db.runSql("INSERT INTO type (name) VALUES ('text-hint')", cb)
}

exports._meta = {
  version: 1
}

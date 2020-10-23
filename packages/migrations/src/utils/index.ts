export function createMigration(
  exports: any,
  {
    up,
    down,
  }: {
    up: (db: Database) => Promise<void>
    down?: (db: Database) => Promise<void>
  }
) {
  exports._meta = {
    version: 1,
  }
  exports.up = (db: CallbackBasedDatabase, cb: Callback) => {
    up(createDatabase(db))
      .then(() => {
        cb(undefined)
      })
      .catch((error) => {
        cb(error)
      })
  }
  exports.down = (db: CallbackBasedDatabase, cb: Callback) => {
    if (typeof down === 'function') {
      down(createDatabase(db))
        .then(() => {
          cb()
        })
        .catch((error) => {
          cb(error)
        })
    } else {
      cb()
    }
  }
}

function createDatabase(db: CallbackBasedDatabase): Database {
  return {
    runSql: async <T>(query: string, ...params: unknown[]) => {
      return new Promise<T>((resolve, reject) => {
        db.runSql(query, ...params, (error: Error | undefined, results: T) => {
          if (error) {
            reject(error)
            return
          }
          resolve(results)
        })
      })
    },
    dropTable: async (table: string) => {
      return new Promise((resolve, reject) => {
        db.dropTable(table, (error?: Error) => {
          if (error) {
            reject(error)
            return
          }
          resolve()
        })
      })
    },
  }
}

type Callback = (error?: Error) => void

type CallbackBasedDatabase = any

export interface Database {
  runSql: <T = void>(query: string, ...params: unknown[]) => Promise<T>
  dropTable: (table: string) => Promise<void>
}

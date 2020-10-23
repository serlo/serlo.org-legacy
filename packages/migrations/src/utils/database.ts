export function createDatabase(db: CallbackBasedDatabase): Database {
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

export type CallbackBasedDatabase = any

export interface Database {
  runSql: <T = void>(query: string, ...params: unknown[]) => Promise<T>
  dropTable: (table: string) => Promise<void>
}

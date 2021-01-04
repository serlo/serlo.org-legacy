/**
 * This file is part of Serlo.org.
 *
 * Copyright (c) 2013-2021 Serlo Education e.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @copyright Copyright (c) 2013-2021 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/serlo.org for the canonical source repository
 */
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

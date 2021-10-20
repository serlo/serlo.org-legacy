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
import { isPlugin } from './edtr-io'
import { CallbackBasedDatabase, createDatabase, Database } from './database'

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

export function createEdtrIoMigration({
  exports,
  migrateState,
}: {
  exports: any
  migrateState: (state: any) => any
}) {
  createMigration(exports, {
    up: async (db) => {
      interface Row {
        id: number
        value: string
        revisionId: number
      }

      const rows = await db.runSql<Row[]>(`
        SELECT erf.id, erf.value, er.id as revisionId
        FROM entity_revision_field erf
          LEFT JOIN entity_revision er on erf.entity_revision_id = er.id
          LEFT JOIN entity e on er.repository_id = e.id
          LEFT JOIN type entity_type on entity_type.id = e.type_id
        WHERE erf.field = 'content'
          AND entity_type.name IN ("article", "course-page",
                                   "event", "grouped-text-excercise",
                                   "text-exercise", "text-exercise-group",
                                   "text-solution")
      `)

      for (const row of rows) {
        let oldState

        try {
          oldState = JSON.parse(row.value)
        } catch (e) {
          // Ignore (some articles have raw text)
        }

        if (!isPlugin(oldState)) {
          // state of legacy markdown editor
          continue
        }

        const newState = JSON.stringify(migrateState(oldState))

        if (newState !== row.value) {
          await db.runSql(
            `UPDATE entity_revision_field SET value = ? WHERE id = ?`,
            newState,
            row.id
          )

          console.log('Updated revision', row.revisionId)
        }
      }
    },
  })
}

type Callback = (error?: Error) => void

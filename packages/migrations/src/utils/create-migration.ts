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
      await changeAllRevisions({
        revisions: await db.runSql<Revision[]>(`
        SELECT erf.id, erf.value as content, erf.entity_revision_id as revisionId
        FROM entity_revision_field erf
        WHERE erf.field = 'content'
      `),
        migrateState,
        async updateRevision(newContent, revision) {
          await db.runSql(
            `UPDATE entity_revision_field SET value = ? WHERE id = ?`,
            newContent,
            revision.id
          )
        },
      })

      await changeAllRevisions({
        revisions: await db.runSql<Revision[]>(`
        SELECT
          page_revision.id, page_revision.content, page_revision.id as revisionId
        FROM page_revision
      `),
        migrateState,
        async updateRevision(newContent, revision) {
          await db.runSql(
            `UPDATE page_revision SET content = ? WHERE id = ?`,
            newContent,
            revision.id
          )
        },
      })
    },
  })
}

async function changeAllRevisions({
  revisions,
  updateRevision,
  migrateState,
}: {
  revisions: Revision[]
  updateRevision: (newContent: string, revision: Revision) => Promise<void>
  migrateState: (state: any) => any
}) {
  for (const revision of revisions) {
    let oldState

    try {
      oldState = JSON.parse(revision.content)
    } catch (e) {
      // Ignore (some articles have raw text)
    }

    if (!isPlugin(oldState)) {
      // state of legacy markdown editor
      continue
    }

    const newState = JSON.stringify(migrateState(oldState))

    if (newState !== revision.content) {
      await updateRevision(newState, revision)

      console.log('Updated revision', revision.revisionId)
    }
  }
}

interface Revision {
  id: number
  content: string
  revisionId: number
}

type Callback = (error?: Error) => void

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

import { clearDeadUuids, createMigration, Database } from './utils'

/**
 * Removes some unused subjects and creates new subjects
 * THIS IS AN IRREVERSIBLE MIGRATION!
 */
createMigration(exports, {
  up: async (db) => {
    await removeSubject(db, {
      instance: 1,
      name: 'Betriebswirtschaftslehre mit Rechnungswesen',
    })
    await removeSubject(db, { instance: 1, name: 'Deutsch als Fremdsprache' })
    await removeSubject(db, { instance: 1, name: 'Musik' })
    await createSubject(db, { instance: 1, name: 'Lerntipps' })
  },
  down: async (db) => {
    await removeSubject(db, { instance: 1, name: 'Lerntipps' })
    await createSubject(db, { instance: 1, name: 'Musik' })
    await createSubject(db, { instance: 1, name: 'Deutsch als Fremdsprache' })
    await createSubject(db, {
      instance: 1,
      name: 'Betriebswirtschaftslehre mit Rechnungswesen',
    })
  },
})

async function createSubject(
  db: Database,
  { instance, name }: { instance: number; name: string }
) {
  const subjectTaxonomy = (
    await db.runSql<[{ id: number }]>(
      `SELECT taxonomy.id FROM taxonomy JOIN type ON taxonomy.type_id = type.id WHERE type.name="subject" AND taxonomy.instance_id = ?`,
      instance
    )
  )[0].id
  await db.runSql(
    `INSERT INTO uuid(trashed, discriminator) VALUES (0, "taxonomyTerm")`
  )
  const taxonomyTerm = await getLastInsertedId(db)
  await db.runSql(
    `INSERT INTO term(instance_id, name) VALUES (?, ?)`,
    instance,
    name
  )
  const term = await getLastInsertedId(db)
  await db.runSql(
    `INSERT INTO term_taxonomy(id, taxonomy_id, term_id, parent_id) VALUES (?, ?, ?, ?);`,
    taxonomyTerm,
    subjectTaxonomy,
    term,
    subjectTaxonomy
  )
}

async function removeSubject(
  db: Database,
  { instance, name }: { instance: number; name: string }
) {
  const parent = (
    await db.runSql<[{ id: number }]>(
      `
        SELECT * FROM taxonomy
          JOIN type ON taxonomy.type_id = type.id
          WHERE taxonomy.instance_id = ?
            AND type.name = "subject"
      `,
      instance
    )
  )[0].id
  await db.runSql(
    `
      DELETE FROM uuid WHERE id = (
        SELECT term_taxonomy.id FROM term_taxonomy
          JOIN term ON term_taxonomy.term_id = term.id
          WHERE term.name = ? AND term_taxonomy.parent_id = ?
       )
    `,
    name,
    parent
  )
  await db.runSql(
    `
      DELETE FROM navigation_page
      WHERE id IN (
        SELECT navigation_parameter.page_id
        FROM navigation_parameter JOIN navigation_parameter_key ON navigation_parameter.key_id = navigation_parameter_key.id
        WHERE name = "label" and VALUE = ?
      )
        AND container_id IN (SELECT id FROM navigation_container WHERE instance_id = ?)
        AND parent_id IS NULL
    `,
    name,
    instance
  )
  await clearDeadUuids(db)
}

async function getLastInsertedId(db: Database): Promise<number> {
  return (
    await db.runSql<[{ 'LAST_INSERT_ID()': number }]>(`SELECT LAST_INSERT_ID()`)
  )[0]['LAST_INSERT_ID()']
}

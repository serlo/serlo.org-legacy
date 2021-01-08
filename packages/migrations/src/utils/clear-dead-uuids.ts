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
import { Database } from './database'

export async function clearDeadUuids(db: Database) {
  await db.runSql(`
    DELETE FROM uuid
      WHERE discriminator = 'taxonomyTerm'
      AND (SELECT count(*) FROM term_taxonomy WHERE term_taxonomy.id = uuid.id) = 0
  `)
  await db.runSql(`
    DELETE FROM uuid
      WHERE discriminator = 'user'
      AND (SELECT count(*) FROM user WHERE user.id = uuid.id) = 0
  `)
  await db.runSql(`
    DELETE FROM uuid
      WHERE discriminator = 'attachment'
      AND (SELECT count(*) FROM attachment_container WHERE attachment_container.id = uuid.id) = 0
  `)
  await db.runSql(`
    DELETE FROM uuid
      WHERE discriminator = 'entity'
      AND (SELECT count(*) FROM entity WHERE entity.id = uuid.id) = 0
  `)
  await db.runSql(`
    DELETE FROM uuid
      WHERE discriminator = 'entityRevision'
      AND (SELECT count(*) FROM entity_revision WHERE entity_revision.id = uuid.id) = 0
  `)
  await db.runSql(`
    DELETE FROM uuid
      WHERE discriminator = 'page'
      AND (SELECT count(*) FROM page_repository WHERE page_repository.id = uuid.id) = 0
  `)
  await db.runSql(`
    DELETE FROM uuid
      WHERE discriminator = 'pageRevision'
      AND (SELECT count(*) FROM page_revision WHERE page_revision.id = uuid.id) = 0
  `)
  await db.runSql(`
    DELETE FROM uuid
      WHERE discriminator = 'comment'
      AND (SELECT count(*) FROM comment WHERE comment.id = uuid.id) = 0
  `)
  await db.runSql(`
    DELETE FROM event_log WHERE EXISTS (
      SELECT ep.id FROM event_parameter ep
        WHERE ep.log_id = event_log.id
        AND NOT EXISTS (SELECT id FROM event_parameter_string eps WHERE eps.event_parameter_id = ep.id)
        AND NOT EXISTS (SELECT id FROM event_parameter_uuid epu WHERE epu.event_parameter_id = ep.id)
    )
  `)
}

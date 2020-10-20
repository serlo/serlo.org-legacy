/**
 * This file is part of Serlo.org.
 *
 * Copyright (c) 2013-2020 Serlo Education e.V.
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
 * @copyright Copyright (c) 2013-2020 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/serlo.org for the canonical source repository
 */

/**
 * Removes some unused subjects and creates new subjects
 */
exports.up = function (db, cb) {
  removeSubject(
    db,
    { instance: 1, name: 'Betriebswirtschaftslehre mit Rechnungswesen' },
    (err) => {
      if (err) {
        return cb(err)
      }

      removeSubject(
        db,
        { instance: 1, name: 'Deutsch als Fremdsprache' },
        (err) => {
          if (err) {
            return cb(err)
          }

          removeSubject(db, { instance: 1, name: 'Musik' }, (err) => {
            if (err) {
              return cb(err)
            }
            createSubject(db, { instance: 1, name: 'Lerntipps' }, cb)
          })
        }
      )
    }
  )
}

exports.down = function (db, cb) {
  createSubject(
    db,
    { instance: 1, name: 'Betriebswirtschaftslehre mit Rechnungswesen' },
    (err) => {
      if (err) {
        return cb(err)
      }

      createSubject(
        db,
        { instance: 1, name: 'Deutsch als Fremdsprache' },
        (err) => {
          if (err) {
            return cb(err)
          }

          createSubject(db, { instance: 1, name: 'Musik' }, (err) => {
            if (err) {
              return cb(err)
            }
            removeSubject(db, { instance: 1, name: 'Lerntipps' }, cb)
          })
        }
      )
    }
  )
}

exports._meta = {
  version: 1,
}

function removeSubject(db, { instance, name }, cb) {
  db.runSql(
    `
      DELETE FROM uuid WHERE id = (
          SELECT uuid.id FROM uuid
              JOIN term_taxonomy ON uuid.id = term_taxonomy.id
              JOIN term ON term_taxonomy.term_id = term.id
              WHERE term.name = ? AND term.instance_id = ?
      )
    `,
    [name, instance],
    cb
  )
}

function createSubject(db, { instance, name }) {
  db.runSql(
    `
      START TRANSACTION;

      SET @instance = ?;
      SET @name = ?;
      SET @subjectTaxonomy = (SELECT taxonomy.id FROM taxonomy JOIN type ON taxonomy.type_id = type.id WHERE type.name="subject" AND taxonomy.instance_id = @instance);

      INSERT INTO uuid(trashed, discriminator)
      VALUES (0, "taxonomyTerm");
      SET @taxonomyTerm = LAST_INSERT_ID();

      INSERT INTO term(instance_id, name)
      VALUES (@instance, @name);
      SET @term = LAST_INSERT_ID();

      INSERT INTO term_taxonomy(id, taxonomy_id, term_id, parent_id)
      VALUES (@taxonomyTerm, @subjectTaxonomy, @term, @subjectTaxonomy);
      SET @taxonomyTerm = LAST_INSERT_ID();

      COMMIT;
    `,
    [instance, name],
    cb
  )
}

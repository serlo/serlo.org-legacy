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
}

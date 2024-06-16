import { InferSelectModel, relations } from 'drizzle-orm'
import {
    index,
    integer,
    primaryKey,
    sqliteTable,
    text,
    uniqueIndex,
} from 'drizzle-orm/sqlite-core'

export const stageEnum = [
    'IDEA',
    'PLAN',
    'DEVELOPMENT',
    'FINISHED',
    'PRODUCTION',
] as [string, ...string[]]

// Add project array relations
export const users = sqliteTable(
    'user',
    {
        id: text('id').primaryKey().notNull(),
        name: text('name').notNull(),
        email: text('email', { length: 191 }).notNull(),
        emailVerified: integer('emailVerified', {
            mode: 'timestamp',
        }),
        image: text('image', { length: 191 }),
        github_url: text('github_url'),
    },
    (user) => ({
        emailIndex: uniqueIndex('users__email__idx').on(user.email),
    })
)

export type SchemaUser = InferSelectModel<typeof users>

export const userProjectRelations = relations(users, ({ many }) => ({
    own_projects: many(projects),
}))

export const tags = sqliteTable(
    'tags',
    {
        id: integer('id', { mode: 'number' })
            .primaryKey({ autoIncrement: true })
            .notNull(),
        name: text('name').notNull(),
    },
    (table) => {
        return {
            tagIdx: index('tag_idx').on(table.name),
        }
    }
)

export const tagRelations = relations(tags, ({ many }) => ({
    projects: many(projectsToTags),
}))

export const projects = sqliteTable(
    'project',
    {
        id: integer('id', { mode: 'number' })
            .primaryKey({ autoIncrement: true })
            .notNull(),
        alt_id: text('alt_id').notNull(),
        name: text('name').notNull(),
        description: text('description'),
        image: text('image'),
        // supporters: text('supporters').array().notNull(),
        stage: text('stage', { enum: stageEnum }).notNull(),
        author_id: text('author_id')
            .notNull()
            .references(() => users.id),
        github_url: text('github_url'),
        website: text('website'),
    },
    (table) => {
        return {
            nameIdx: index('name_idx').on(table.name),
        }
    }
)

export type SchemaProject = InferSelectModel<typeof projects>

export const projectUserRelations = relations(
    projects,
    ({ one, many }) => ({
        author: one(users, {
            fields: [projects.author_id],
            references: [users.id],
        }),
        tags: many(projectsToTags),
    })
)

export const projectsToTags = sqliteTable(
    'projects_to_tags',
    {
        project_id: integer('project_id')
            .notNull()
            .references(() => projects.id, { onDelete: 'cascade' }), // ???
        tag_id: integer('tag_id')
            .notNull()
            .references(() => tags.id, { onDelete: 'cascade' }), // ???
    },
    (t) => ({
        tagTIdx: index('tag_t_idx').on(t.tag_id),
        projectTIdx: index('project_t_idx').on(t.project_id),
        pk: primaryKey(t.tag_id, t.project_id),
    })
)

export const projectsToTagsRelations = relations(
    projectsToTags,
    ({ one }) => ({
        project: one(projects, {
            fields: [projectsToTags.project_id],
            references: [projects.id],
        }),
        tag: one(tags, {
            fields: [projectsToTags.tag_id],
            references: [tags.id],
        }),
    })
)

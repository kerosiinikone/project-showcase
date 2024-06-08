import { InferSelectModel, relations } from 'drizzle-orm'
import {
    index,
    integer,
    primaryKey,
    sqliteTable,
    text,
    uniqueIndex,
} from 'drizzle-orm/sqlite-core'
import type { AdapterAccount } from 'next-auth/adapters'

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
        name: text('name'),
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

export const accounts = sqliteTable(
    'account',
    {
        userId: text('userId')
            .notNull()
            .references(() => users.id, { onDelete: 'cascade' }),
        type: text('type').$type<AdapterAccount>().notNull(),
        provider: text('provider').notNull(),
        providerAccountId: text('providerAccountId').notNull(),
        refresh_token: text('refresh_token'),
        access_token: text('access_token'),
        expires_at: integer('expires_at'),
        token_type: text('token_type'),
        scope: text('scope'),
        id_token: text('id_token'),
        session_state: text('session_state'),
    },
    (account) => ({
        compoundKey: primaryKey({
            columns: [account.provider, account.providerAccountId],
        }),
    })
)

export type SchemaUser = InferSelectModel<typeof users>

export const userProjectRelations = relations(users, ({ many }) => ({
    own_projects: many(projects),
    supported_projects: many(usersToProjects),
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
        supporters: many(usersToProjects),
        tags: many(projectsToTags),
    })
)

export const usersToProjects = sqliteTable(
    'users_to_projects',
    {
        user_id: text('user_id')
            .notNull()
            .references(() => users.id, { onDelete: 'cascade' }), // ???
        project_id: integer('project_id')
            .notNull()
            .references(() => projects.id, { onDelete: 'cascade' }), // ???
    },
    (t) => ({
        userIdx: index('user_idx').on(t.user_id),
        projectIdx: index('project_idx').on(t.project_id),
        pk: primaryKey(t.user_id, t.project_id),
    })
)

export const usersToProjectsRelations = relations(
    usersToProjects,
    ({ one }) => ({
        project: one(projects, {
            fields: [usersToProjects.project_id],
            references: [projects.id],
        }),
        user: one(users, {
            fields: [usersToProjects.user_id],
            references: [users.id],
        }),
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

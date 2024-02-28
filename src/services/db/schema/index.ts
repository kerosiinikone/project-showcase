import {
    text,
    timestamp,
    pgTable,
    pgEnum,
    integer,
    varchar,
    uniqueIndex,
    index,
    primaryKey,
    serial,
} from 'drizzle-orm/pg-core'
import type { AdapterAccount } from '@auth/core/adapters'
import { Stage } from '@/models/Project/types'
import { InferSelectModel, relations } from 'drizzle-orm'

export const stageEnum = pgEnum('stage', [
    'IDEA',
    'PLAN',
    'DEVELOPMENT',
    'FINISHED',
    'PRODUCTION',
])

// Add project array relations
export const users = pgTable(
    'user',
    {
        id: text('id').primaryKey().notNull(),
        name: text('name'),
        email: varchar('email', { length: 191 }).notNull(),
        emailVerified: timestamp('emailVerified'),
        image: varchar('image', { length: 191 }),
        created_at: timestamp('created_at', { mode: 'date' })
            .notNull()
            .defaultNow(),
        updated_at: timestamp('updated_at', { mode: 'date' })
            .notNull()
            .defaultNow(),
        github_url: text('github_url'),
    },
    (user) => ({
        emailIndex: uniqueIndex('users__email__idx').on(user.email),
    })
)

export type SchemaUser = InferSelectModel<typeof users>

export const userProjectRelations = relations(users, ({ many }) => ({
    own_projects: many(projects),
    supported_projects: many(usersToProjects),
}))

export const tags = pgTable('tags', {
    id: serial('id').primaryKey().notNull(),
    name: text('name').notNull(),
})

export const projects = pgTable(
    'project',
    {
        id: serial('id').primaryKey().notNull(),
        alt_id: text('alt_id').notNull(),
        name: text('name').notNull(),
        description: text('description'),
        image: text('image'),
        // supporters: text('supporters').array().notNull(),
        stage: stageEnum('stage').$type<Stage>().notNull(),
        author_id: text('author_id')
            .notNull()
            .references(() => users.id),
        github_url: text('github_url'),
        created_at: timestamp('created_at', { mode: 'date' })
            .defaultNow()
            .notNull(),
        updated_at: timestamp('updated_at', { mode: 'date' })
            .defaultNow()
            .notNull(),
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
    })
)

export const usersToProjects = pgTable(
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

export const accounts = pgTable(
    'account',
    {
        userId: text('userId')
            .notNull()
            .references(() => users.id, { onDelete: 'cascade' })
            .primaryKey(),
        type: text('type').$type<AdapterAccount['type']>().notNull(),
        provider: text('provider').notNull(),
        providerAccountId: text('providerAccountId').notNull(),
        refresh_token: text('refresh_token'),
        access_token: text('access_token'),
        expires_at: integer('expires_at'),
        token_type: text('token_type'),
        scope: text('scope'),
        id_token: text('id_token'),
        session_state: text('session_state'),
        createdAt: timestamp('createdAt', { mode: 'date' })
            .defaultNow()
            .notNull(),
        updatedAt: timestamp('updatedAt', { mode: 'date' })
            .defaultNow()
            .notNull(),
    },
    (account) => ({
        providerProviderAccountIdIndex: uniqueIndex(
            'accounts__provider__providerAccountId__idx'
        ).on(account.provider, account.providerAccountId),
        userIdIndex: index('accounts__userId__idx').on(
            account.userId
        ),
    })
)

// export const sessions = pgTable(
//     'session',
//     {
//         sessionToken: text('sessionToken').notNull().primaryKey(),
//         userId: text('userId')
//             .notNull()
//             .references(() => users.id, { onDelete: 'cascade' }),
//         expires: timestamp('expires', { mode: 'date' }).notNull(),
//     },
//     (session) => ({
//         sessionTokenIndex: uniqueIndex(
//             'sessions__sessionToken__idx'
//         ).on(session.sessionToken),
//         userIdIndex: index('sessions__userId__idx').on(
//             session.userId
//         ),
//     })
// )

// export const verificationTokens = pgTable(
//     'verificationToken',
//     {
//         identifier: text('identifier').notNull(),
//         token: text('token').notNull(),
//         expires: timestamp('expires', { mode: 'date' }).notNull(),
//     },
//     (vt) => ({
//         compoundKey: primaryKey(vt.identifier, vt.token),
//     })
// )

import {
    text,
    timestamp,
    pgTable,
    uuid,
    pgEnum,
    integer,
    varchar,
    uniqueIndex,
    index,
    primaryKey,
} from 'drizzle-orm/pg-core'
import type { AdapterAccount } from '@auth/core/adapters'
import { Stage } from '@/models/Project/types'

export const stageEnum = pgEnum('stage', [
    'IDEA',
    'PLAN',
    'DEVELOPMENT',
    'FINISHED',
    'PRODUCTION',
])

export const projects = pgTable('project', {
    id: uuid('id').primaryKey(),
    name: text('name').notNull(),
    description: text('description').default('A project'),
    image: text('image'),
    stage: stageEnum('stage').$type<Stage>().notNull(),
    author_id: uuid('authorID').notNull(),
    github_url: text('github_url'),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
    updatedAt: timestamp('updatedAt').defaultNow().notNull(),
})

export const accounts = pgTable(
    'account',
    {
        userId: uuid('userId')
            .notNull()
            .references(() => users.id, { onDelete: 'cascade' }),
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
        createdAt: timestamp('createdAt').defaultNow().notNull(),
        updatedAt: timestamp('updatedAt').defaultNow().notNull(),
    },
    (account) => ({
        providerProviderAccountIdIndex: uniqueIndex(
            'accounts__provider__providerAccountId__idx'
        ).on(account.provider, account.providerAccountId),
        userIdIndex: index('accounts__userId__idx').on(account.userId),
    })
)

export const sessions = pgTable(
    'session',
    {
        sessionToken: text('sessionToken').notNull().primaryKey(),
        userId: uuid('userId')
            .notNull()
            .references(() => users.id, { onDelete: 'cascade' }),
        expires: timestamp('expires', { mode: 'date' }).notNull(),
    },
    (session) => ({
        sessionTokenIndex: uniqueIndex('sessions__sessionToken__idx').on(
            session.sessionToken
        ),
        userIdIndex: index('sessions__userId__idx').on(session.userId),
    })
)

export const users = pgTable(
    'user',
    {
        id: uuid('id').primaryKey().notNull(),
        name: text('name'),
        own_projects: uuid('own_projects').array(),
        projects: uuid('projects').array(),
        email: varchar('email', { length: 191 }).notNull(),
        emailVerified: timestamp('emailVerified'),
        image: varchar('image', { length: 191 }),
        created_at: timestamp('created_at').notNull().defaultNow(),
        updated_at: timestamp('updated_at').notNull().defaultNow(),
    },
    (user) => ({
        emailIndex: uniqueIndex('users__email__idx').on(user.email),
    })
)

export const verificationTokens = pgTable(
    'verificationToken',
    {
        identifier: text('identifier').notNull(),
        token: text('token').notNull(),
        expires: timestamp('expires', { mode: 'date' }).notNull(),
    },
    (vt) => ({
        compoundKey: primaryKey(vt.identifier, vt.token),
    })
)

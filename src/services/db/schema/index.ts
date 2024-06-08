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
import type { AdapterAccount } from "next-auth/adapters"
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

export const accounts = pgTable(
    "account",
    {
      userId: text("userId")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
      type: text("type").$type<AdapterAccount>().notNull(),
      provider: text("provider").notNull(),
      providerAccountId: text("providerAccountId").notNull(),
      refresh_token: text("refresh_token"),
      access_token: text("access_token"),
      expires_at: integer("expires_at"),
      token_type: text("token_type"),
      scope: text("scope"),
      id_token: text("id_token"),
      session_state: text("session_state"),
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

export const tags = pgTable(
    'tags',
    {
        id: serial('id').primaryKey().notNull(),
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
        website: text('website'),
        created_at: timestamp('created_at', { mode: 'date' })
            .defaultNow()
            .notNull(),
        /* 
            customTimestamp('createdAt', {
                withTimezone: true,
                precision: 3,
                })
            .notNull().default(sql`now()`), */
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
        tags: many(projectsToTags),
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

export const projectsToTags = pgTable(
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

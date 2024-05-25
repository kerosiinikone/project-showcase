import { UserType } from '@/models/User/types'
import { UserSchema } from '@/models/User/validation'
import { and, eq } from 'drizzle-orm'
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import type { NextAuthConfig } from 'next-auth'
import { v4 } from 'uuid'
import { z } from 'zod'
import * as schema from '../../db/schema'

type Adapter = NextAuthConfig['adapter']

/*
    Mostly copied from the actual "@auth/drizzle"
*/

export function createTables() {
    const users = schema.users
    const accounts = schema.accounts

    return { users, accounts }
}

export type DefaultSchema = ReturnType<typeof createTables>

function createGithubLink(name: string) {
    const BASE_LINK = 'https://github.com'
    return `${BASE_LINK}/${name}`
}

function validateSchema(schema: z.ZodSchema, data: unknown) {
    const result = schema.safeParse(data)
    if (!result.success) {
        throw new Error(
            result.error.issues
                .map((issue) => issue.message)
                .join(', ')
        )
    }
}

export function CustomDrizzleAdapter(
    client: PostgresJsDatabase<typeof schema>
): Adapter {
    const { users, accounts } = createTables()

    return {
        async createUser(data: any) {
            const newUser = {
                ...(data as UserType),
                id: v4(),
                github_url: createGithubLink(data.name),
            }

            validateSchema(UserSchema, data)

            return await client
                .insert(users)
                .values(newUser)
                .returning()
                .then((res) => res[0] ?? null)
        },
        async getUser(data) {
            return await client
                .select()
                .from(users)
                .where(eq(users.id, data))
                .then((res) => res[0] ?? null)
        },
        async getUserByEmail(data) {
            return await client
                .select()
                .from(users)
                .where(eq(users.email, data))
                .then((res) => res[0] ?? null)
        },
        async updateUser(data) {
            if (!data.id) {
                throw new Error('No user id.')
            }

            return await client
                .update(users)
                .set(data)
                .where(eq(users.id, data.id))
                .returning()
                .then((res) => res[0])
        },
        async linkAccount(rawAccount: any) {
            await client
                .insert(accounts)
                .values(rawAccount)
                .returning()
                .then((res) => res[0])
        },
        async getUserByAccount(account) {
            const dbAccount =
                (await client
                    .select()
                    .from(accounts)
                    .where(
                        and(
                            eq(
                                accounts.providerAccountId,
                                account.providerAccountId
                            ),
                            eq(accounts.provider, account.provider)
                        )
                    )
                    .leftJoin(users, eq(accounts.userId, users.id))
                    .then((res) => res[0])) ?? null

            return dbAccount?.user ?? null
        },
        async deleteUser(id) {
            await client
                .delete(users)
                .where(eq(users.id, id))
                .returning()
                .then((res) => res[0] ?? null)
        },
        async unlinkAccount(account) {
            const { type, provider, providerAccountId, userId } =
                await client
                    .delete(accounts)
                    .where(
                        and(
                            eq(
                                accounts.providerAccountId,
                                account.providerAccountId
                            ),
                            eq(accounts.provider, account.provider)
                        )
                    )
                    .returning()
                    .then((res) => res[0] ?? null)

            return { provider, type, providerAccountId, userId }
        },
    }
}

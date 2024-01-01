import { and, eq } from 'drizzle-orm'
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import * as schema from '../../db/schema'
import type { NextAuthConfig } from 'next-auth'
import { v4 } from 'uuid'
import { User } from '@/models/User/model'
import { UserType } from '@/models/User/types'

type Adapter = NextAuthConfig['adapter']

/*
    Mostly copied from the actual "DrizzleAdapter"
*/

export function createTables() {
    const users = schema.users
    const accounts = schema.accounts
    const sessions = schema.sessions
    const verificationTokens = schema.verificationTokens

    return { users, accounts, sessions, verificationTokens }
}

export type DefaultSchema = ReturnType<typeof createTables>

export function CustomDrizzleAdapter(
    client: PostgresJsDatabase<typeof schema>
): Adapter {
    const { users, accounts, sessions, verificationTokens } = createTables()

    return {
        async createUser(data: any) {
            const newUser = new User({ ...(data as UserType), id: v4() })
            return await client
                .insert(users)
                .values(newUser)
                .returning()
                .then((res) => res[0] ?? null)
        },
        async getUser(data: any) {
            return await client
                .select()
                .from(users)
                .where(eq(users.id, data))
                .then((res) => res[0] ?? null)
        },
        async getUserByEmail(data: any) {
            return await client
                .select()
                .from(users)
                .where(eq(users.email, data))
                .then((res) => res[0] ?? null)
        },
        async createSession(data: any) {
            return await client
                .insert(sessions)
                .values(data)
                .returning()
                .then((res) => res[0])
        },
        async getSessionAndUser(data: any) {
            return await client
                .select({
                    session: sessions,
                    user: users,
                })
                .from(sessions)
                .where(eq(sessions.sessionToken, data))
                .innerJoin(users, eq(users.id, sessions.userId))
                .then((res) => res[0] ?? null)
        },
        async updateUser(data: any) {
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
        async updateSession(data: any) {
            return await client
                .update(sessions)
                .set(data)
                .where(eq(sessions.sessionToken, data.sessionToken))
                .returning()
                .then((res) => res[0])
        },
        async linkAccount(rawAccount: any) {
            const updatedAccount = await client
                .insert(accounts)
                .values(rawAccount)
                .returning()
                .then((res) => res[0])

            // Drizzle will return `null` for fields that are not defined.
            // However, the return type is expecting `undefined`.
            const account = {
                ...updatedAccount,
                access_token: updatedAccount.access_token ?? undefined,
                token_type: updatedAccount.token_type ?? undefined,
                id_token: updatedAccount.id_token ?? undefined,
                refresh_token: updatedAccount.refresh_token ?? undefined,
                scope: updatedAccount.scope ?? undefined,
                expires_at: updatedAccount.expires_at ?? undefined,
                session_state: updatedAccount.session_state ?? undefined,
            }

            // return account;
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

            if (!dbAccount) {
                return null
            }

            return dbAccount.user
        },
        async deleteSession(sessionToken) {
            const session = await client
                .delete(sessions)
                .where(eq(sessions.sessionToken, sessionToken))
                .returning()
                .then((res) => res[0] ?? null)

            return session
        },
        async createVerificationToken(token) {
            return await client
                .insert(verificationTokens)
                .values(token)
                .returning()
                .then((res) => res[0])
        },
        async useVerificationToken(token) {
            try {
                return await client
                    .delete(verificationTokens)
                    .where(
                        and(
                            eq(verificationTokens.identifier, token.identifier),
                            eq(verificationTokens.token, token.token)
                        )
                    )
                    .returning()
                    .then((res) => res[0] ?? null)
            } catch (err) {
                throw new Error('No verification token found.')
            }
        },
        async deleteUser(id) {
            await client
                .delete(users)
                .where(eq(users.id, id))
                .returning()
                .then((res) => res[0] ?? null)
        },
        async unlinkAccount(account) {
            const { type, provider, providerAccountId, userId } = await client
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
        },
    }
}

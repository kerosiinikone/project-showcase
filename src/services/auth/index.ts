import NextAuth, { DefaultSession } from 'next-auth'
import * as database from '../db.server'
import { CustomDrizzleAdapter } from './adapter/drizzle'
import Credentials from 'next-auth/providers/credentials'
import authConfig from './auth.config'
import { getGithubAccessToken } from '@/operations/user.operations'
import { users } from '../db/schema/test'
import { eq } from 'drizzle-orm'

declare module 'next-auth' {
    // TODO: Find a better solution, access token should be stored securely
    interface Session {
        user: {
            gh_access_token: string
        } & DefaultSession['user']
    }
}

const testCredentials = Credentials({
    id: 'password',
    name: 'Password',
    credentials: {
        password: { label: 'Password', type: 'password' },
    },
    authorize: async (credentials) => {
        if (credentials.password === process.env.TEST_PASSWORD) {
            const user = await database.default.testDb
                ?.select()
                .from(users)
                .where(eq(users.id, '1'))
                .then((res) => res[0] ?? null)

            if (!user) {
                await database.default.testDb?.insert(users).values({
                    id: '1',
                    email: 'test@gmail.com',
                    name: 'Test Test',
                })
            }
            return {
                id: '1',
                email: 'test@gmail.com',
                name: 'Test Test',
            }
        } else {
            return {}
        }
    },
})

export const GithubAccountDBAdapter = CustomDrizzleAdapter(
    database.default.db
)

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
} = NextAuth({
    pages: {
        signIn:
            process.env.ENVIRONMENT !== 'test' &&
            process.env.ENVIRONMENT !== 'staging'
                ? '/auth/github'
                : undefined,
    },
    callbacks: {
        async session({ session, token }) {
            if (session && session.user) {
                if (
                    process.env.ENVIRONMENT !== 'test' &&
                    process.env.ENVIRONMENT !== 'staging'
                ) {
                    session.user.gh_access_token =
                        await getGithubAccessToken(token.sub!)
                }
                session.user.id = token.sub!
            }

            return session
        },
    },
    adapter:
        process.env.ENVIRONMENT !== 'test' &&
        process.env.ENVIRONMENT !== 'staging'
            ? GithubAccountDBAdapter
            : undefined,
    session: { strategy: 'jwt' },
    secret: process.env.SECRET!,
    ...authConfig,
    providers:
        process.env.ENVIRONMENT !== 'test' &&
        process.env.ENVIRONMENT !== 'staging'
            ? authConfig.providers
            : [testCredentials],
})

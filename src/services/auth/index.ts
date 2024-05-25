import NextAuth, { DefaultSession } from 'next-auth'
import db from '../db.server'
import { CustomDrizzleAdapter } from './adapter/drizzle'
import Credentials from 'next-auth/providers/credentials'
import authConfig from './auth.config'
import { getGithubAccessToken } from '@/operations/user.operations'

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
    authorize: (credentials) => {
        if (credentials.password === process.env.TEST_PASSWORD) {
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

export const GithubAccountDBAdapter = CustomDrizzleAdapter(db)

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
} = NextAuth({
    pages: {
        signIn:
            process.env.ENVIRONMENT !== 'test'
                ? '/auth/github'
                : undefined,
    },
    callbacks: {
        async session({ session, token }) {
            if (session && session.user) {
                if (process.env.ENVIRONMENT !== 'test') {
                    session.user.gh_access_token =
                        await getGithubAccessToken(token.sub!)
                }
                session.user.id = token.sub!
            }

            return session
        },
    },
    adapter:
        process.env.ENVIRONMENT !== 'test'
            ? GithubAccountDBAdapter
            : undefined,
    session: { strategy: 'jwt' },
    secret: process.env.SECRET!,
    ...authConfig,
    providers:
        process.env.ENVIRONMENT !== 'test'
            ? authConfig.providers
            : [testCredentials],
})

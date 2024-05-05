import NextAuth, { DefaultSession } from 'next-auth'
import db from '../db.server'
import { CustomDrizzleAdapter } from './adapter/drizzle'
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

export const GithubAccountDBAdapter = CustomDrizzleAdapter(db)

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
} = NextAuth({
    pages: {
        signIn: '/auth/github',
    },
    callbacks: {
        async session({ session, token }) {
            if (session && session.user) {
                const access_token = await getGithubAccessToken(
                    token.sub!
                )
                session.user.gh_access_token = access_token
                session.user.id = token.sub!
            }

            return session
        },
    },
    adapter: GithubAccountDBAdapter,
    session: { strategy: 'jwt' },
    secret: process.env.SECRET!,
    ...authConfig,
})

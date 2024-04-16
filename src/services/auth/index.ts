import NextAuth from 'next-auth'
import db from '../db.server'
import { CustomDrizzleAdapter } from './adapter/drizzle'
import authConfig from './auth.config'

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

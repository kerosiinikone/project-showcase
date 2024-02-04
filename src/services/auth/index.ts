import NextAuth, { DefaultSession } from 'next-auth'
import authConfig from './auth.config'
import { getExistingUserById } from '@/operations/user.operations'
import db from '../db.server'
import { CustomDrizzleAdapter } from './adapter/drizzle'

// declare module 'next-auth' {
//     interface Session extends DefaultSession {
//         user: {
//             id: string
//             own_projects: string[]
//         } & DefaultSession['user']
//     }
// }

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
    adapter: GithubAccountDBAdapter, // Database vs. JWT
    session: { strategy: 'jwt' },
    secret: process.env.SECRET!,
    ...authConfig,
})

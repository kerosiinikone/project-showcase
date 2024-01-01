import NextAuth, { DefaultSession } from 'next-auth'
import authConfig from './auth.config'
import db from '../db.server'
import { CustomDrizzleAdapter } from './adapter/drizzle'
import { getExistingUserById } from '@/operations/user.operations'

declare module 'next-auth' {
    interface Session extends DefaultSession {
        user: {
            id: string
            own_projects: string[]
        } & DefaultSession['user']
    }
}

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
} = NextAuth({
    callbacks: {
        async session({ session, token }) {
            let loggedInUser

            try {
                loggedInUser = (await getExistingUserById(token.sub!))[0]
                if (loggedInUser) {
                    session.user.own_projects = loggedInUser?.own_projects!
                }
            } catch (error) {
                // Invalidate session
            }

            if (session && session.user) {
                session.user.id = token.sub!
            }

            return session
        },
    },
    adapter: CustomDrizzleAdapter(db),
    session: { strategy: 'jwt' },
    secret: process.env.SECRET!,
    ...authConfig,
})

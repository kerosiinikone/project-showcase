import NextAuth from 'next-auth'
import authConfig from './auth.config'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import db from '../db.server'
import { User } from '@/models/User/model'
import { UserType } from '@/models/User/types'

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
} = NextAuth({
    callbacks: {
        async signIn({ user }) {
            try {
                // create / fetch user and auth VALIDATION
                new User(user as UserType)
                return true
            } catch (error) {
                return false
            }
        },
        async session({ session, user }) {
            if (session && session.user) {
                session.user.id = user.id
            }
            return session
        },
    },
    adapter: DrizzleAdapter(db),
    session: { strategy: 'database' },
    secret: process.env.SECRET!,
    ...authConfig,
})

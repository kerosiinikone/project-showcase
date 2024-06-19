import authConfig from '@/services/auth/auth.config'
import NextAuth from 'next-auth'
import { NextResponse } from 'next/server'
import { ratelimit } from './middleware/ratelimit'

const { auth } = NextAuth(authConfig)

export default auth(async (req) => {
    const { nextUrl } = req
    const isAuthenticated = !!req.auth

    if (
        req.method === 'POST' &&
        process.env.ENVIRONMENT === 'production'
    ) {
        const ip = req.ip ?? '127.0.0.1'
        const rl = await ratelimit?.limit(ip)
        if (!rl?.success)
            return NextResponse.json(
                { error: 'rate limited' },
                { status: 429 }
            )
    }

    if (!isAuthenticated && nextUrl.pathname === '/dashboard')
        return Response.redirect(new URL('/auth/github', nextUrl))

    return NextResponse.next()
})

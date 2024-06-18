import authConfig from '@/services/auth/auth.config'
import NextAuth from 'next-auth'
import { NextResponse } from 'next/server'
import { limit } from './middleware/ratelimit'

const { auth } = NextAuth(authConfig)

export default auth(async (req) => {
    const { nextUrl } = req
    const isAuthenticated = !!req.auth

    if (req.method === 'POST') {
        const ip =
            req.ip ?? req.headers.get('X-Forwarded-For') ?? 'unknown'
        const isRateLimited = await limit(ip)
        if (isRateLimited)
            return NextResponse.json(
                { error: 'rate limited' },
                { status: 429 }
            )
    }

    if (!isAuthenticated && nextUrl.pathname === '/dashboard')
        return Response.redirect(new URL('/auth/github', nextUrl))

    return NextResponse.next()
})

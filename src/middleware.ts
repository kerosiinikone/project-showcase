import NextAuth from 'next-auth'
import authConfig from '@/services/auth/auth.config'
import Redis from 'ioredis'
import requestIp from 'request-ip'

// type Result = {
//     limit: number
//     remaining: number
//     success: boolean
// }

const { auth } = NextAuth(authConfig)

// const redis = new Redis({
//     port: 33267,
//     host: process.env.REDIS_HOST,
//     password: process.env.REDIS_PASSWORD,
// })

// const rateLimiter = async (
//     client: Redis,
//     ip: string,
//     limit: number,
//     duration: number
// ): Promise<Result> => {
//     const key = `rate_limit:${ip}`
//     let currentCount = await client.get(key)
//     let count = parseInt(currentCount as string, 10) || 0
//     if (count > limit) {
//         return { limit, remaining: limit - count, success: false }
//     }
//     client.incr(key)
//     client.expire(key, duration)
//     return { limit, remaining: limit - (count + 1), success: true }
// }

export default auth((req) => {
    const { nextUrl } = req
    const isAuthenticated = !!req.auth

    // const requestHeaders = new Headers(req.headers)

    // if (req.method === 'POST') {
    //     const identifier = requestIp.getClientIp(req)
    //     const result = await rateLimiter(redis, identifier!, 2, 10)

    //     requestHeaders.set(
    //         'X-RateLimit-Limit',
    //         result.limit.toString()
    //     )
    //     requestHeaders.set(
    //         'X-RateLimit-Remaining',
    //         result.remaining.toString()
    //     )

    //     if (!result.success) {
    //         return Response.redirect(new URL('/too-many', nextUrl))
    //     }
    // }

    if (!isAuthenticated && nextUrl.pathname === '/dashboard')
        return Response.redirect(new URL('/auth/github', nextUrl))
})

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}

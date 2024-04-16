import NextAuth from 'next-auth'
import authConfig from '@/services/auth/auth.config'

const { auth } = NextAuth(authConfig)

export default auth((req) => {
    const { nextUrl } = req
    const isAuthenticated = !!req.auth

    if (!isAuthenticated && nextUrl.pathname === '/dashboard')
        return Response.redirect(new URL('/auth/github', nextUrl))
})

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}

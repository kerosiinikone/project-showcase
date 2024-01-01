import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { useAsyncAuth } from './hooks/useAsyncAuth'

export async function middleware(request: NextRequest) {
    const session = await useAsyncAuth()
    if (!session) {
        return NextResponse.redirect(new URL('/', request.url))
    }
    // const response = NextResponse.next()
    // response.cookies.set('sessionToken', session.user.id)
    // return response
}

export const config = {
    matcher: '/dashboard',
}

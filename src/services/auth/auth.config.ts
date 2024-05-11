import Github from 'next-auth/providers/github'
import type { NextAuthConfig } from 'next-auth'

const REQUEST_SCOPE = 'user,public_repo'

// Boilerplate

const providers = [
    Github({
        authorization: { params: { scope: REQUEST_SCOPE } },
        clientId: process.env.AUTH_GITHUB_ID,
        clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
]

export default {
    providers,
} satisfies NextAuthConfig

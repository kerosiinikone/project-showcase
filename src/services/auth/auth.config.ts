import Github from 'next-auth/providers/github'

import type { NextAuthConfig } from 'next-auth'

const REQUEST_SCOPE = 'user,public_repo'

// Boilerplate

export default {
    providers: [
        Github({
            authorization: { params: { scope: REQUEST_SCOPE } },
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
        }),
    ],
} satisfies NextAuthConfig

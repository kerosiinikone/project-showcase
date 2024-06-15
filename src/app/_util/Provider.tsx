'use client'

import { httpBatchLink } from '@trpc/client'
import React, { useState } from 'react'
import { api } from './trpc'
import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'

function getBaseUrl() {
    if (typeof window !== 'undefined') return ''
    return process.env.NEXT_PUBLIC_CLIENT_URL
}

export default function Provider({
    children,
}: React.PropsWithChildren) {
    const [queryClient] = useState(() => new QueryClient())
    const [trpcClient] = useState(() =>
        api.createClient({
            links: [
                httpBatchLink({
                    url: `${getBaseUrl()}/api/trpc`,
                }),
            ],
        })
    )
    return (
        <api.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </api.Provider>
    )
}

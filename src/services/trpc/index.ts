import 'server-only'

import { useAsyncAuth } from '@/services/auth/util/useAsyncAuth'
import { initTRPC } from '@trpc/server'
import { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch'

/* eslint-disable */

export type Context = Awaited<ReturnType<typeof createContext>>

export async function createContext(_: FetchCreateContextFnOptions) {
    const session = await useAsyncAuth()
    return {
        session,
    }
}

export const t = initTRPC.context<Context>().create({})

export const router = t.router
export const procedure = t.procedure

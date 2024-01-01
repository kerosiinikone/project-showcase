import { useAsyncAuth } from '@/hooks/useAsyncAuth'
import { initTRPC } from '@trpc/server'
import { CreateNextContextOptions } from '@trpc/server/adapters/next'

export type Context = Awaited<ReturnType<typeof createContext>>

export async function createContext(opts: CreateNextContextOptions) {
    const session = await useAsyncAuth()
    return {
        session,
    }
}

export const t = initTRPC.context<Context>().create()

export const router = t.router
export const procedure = t.procedure

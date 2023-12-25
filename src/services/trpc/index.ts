import { useAsyncAuth } from '@/hooks/useAsyncAuth'
import { initTRPC } from '@trpc/server'
import { CreateNextContextOptions } from '@trpc/server/adapters/next'
import { isAuth } from './middleware'

export const createContext = async (opts: CreateNextContextOptions) => {
    const session = await useAsyncAuth()
    return {
        session,
    }
}

type Context = Awaited<ReturnType<typeof createContext>>
export const t = initTRPC.context<Context>().create()

export const middleware = t.middleware
export const router = t.router
export const procedure = t.procedure
export const protectedProcedure = t.procedure.use(isAuth)

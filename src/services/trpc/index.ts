import { useAsyncAuth } from '@/services/auth/util/useAsyncAuth'
import { initTRPC } from '@trpc/server'
import { CreateNextContextOptions } from '@trpc/server/adapters/next'
import { ZodError } from 'zod'

export type Context = Awaited<ReturnType<typeof createContext>>

export async function createContext(opts: CreateNextContextOptions) {
    const session = await useAsyncAuth()
    return {
        session,
    }
}

export const t = initTRPC.context<Context>().create({
    errorFormatter(opts) {
        const { shape, error } = opts
        return {
            ...shape,
            data: {
                ...shape.data,
                zodError:
                    error.code === 'BAD_REQUEST' &&
                    error.cause instanceof ZodError
                        ? error.cause.flatten()
                        : null,
            },
        }
    },
})

export const router = t.router
export const procedure = t.procedure

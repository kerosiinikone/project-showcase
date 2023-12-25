import { useAsyncAuth } from '@/hooks/useAsyncAuth'
import { t } from '.'
import { TRPCError } from '@trpc/server'

export const isAuth = t.middleware(async ({ next }) => {
    const session = await useAsyncAuth()

    if (!session?.user?.id) {
        throw new TRPCError({
            code: 'UNAUTHORIZED',
        })
    }
    return next({
        ctx: {
            session,
        },
    })
})

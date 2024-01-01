import { useAsyncAuth } from '@/hooks/useAsyncAuth'
import { procedure, t } from '.'
import { TRPCError } from '@trpc/server'
import db from '../db.server'

export const protectedProcedure = procedure.use(
    t.middleware(async ({ next }) => {
        const session = await useAsyncAuth()

        if (!session?.user?.id) {
            throw new TRPCError({
                code: 'UNAUTHORIZED',
            })
        }
        return next({
            ctx: {
                session,
                db,
            },
        })
    })
)

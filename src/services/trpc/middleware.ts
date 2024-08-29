import { useAsyncAuth } from '@/services/auth/util/useAsyncAuth'
import { procedure, t } from '.'
import db from '../db.server'
import { TRPCError } from '@trpc/server'

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

import actions from '@/actions/user.actions'
import { procedure, router } from '.'

const userActionsRouter = router({
    createNewUserAction: actions.createUserAction,
    getExistingUserAction: actions.getExistingUserAction,
})

export const appRouter = router({
    health_check: procedure.query(() => {
        return {
            status: 'Healthy',
        }
    }),
    userActionsRouter,
})

export type AppRouter = typeof appRouter

// export const authorizedProcedure = procedure
//     .input()
//     .use((opts) => {
//         if (opts.input.townName !== 'Pucklechurch') {
//             throw new TRPCError({
//                 code: 'FORBIDDEN',
//                 message: "We don't take kindly to out-of-town folk",
//             })
//         }

//         return opts.next()
//     })

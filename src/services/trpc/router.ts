import userActions from '@/actions/user.actions'
import projectActions from '@/actions/project.actions'
import { procedure, router } from '.'

const userActionsRouter = router({
    createNewUserAction: userActions.createUserAction,
    getExistingUserAction: userActions.getExistingUserAction,
})

const projectActionsRouter = router({
    createProjectAction: projectActions.createProjectAction,
})

export const appRouter = router({
    health_check: procedure.query(() => {
        return {
            status: 'Healthy',
        }
    }),
    userActionsRouter,
    projectActionsRouter,
})

export type AppRouter = typeof appRouter

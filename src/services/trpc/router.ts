import { procedure, router } from '.'
import userActions from '@/procedures/user.procedures'
import projectActions from '@/procedures/project.procedures'

const user = router({
    createNewUserAction: userActions.createUserAction,
    getExistingUserAction: userActions.getExistingUserAction,
    getUserRepos: userActions.getUserRepos,
})

const project = router({
    createProject: projectActions.createProject,
    getProjects: projectActions.getProjects,
    getProjectById: projectActions.getProjectById,
    deleteProjectById: projectActions.deleteProjectById,
})

export const appRouter = router({
    health_check: procedure.query(() => {
        return {
            status: 'Healthy',
        }
    }),
    user,
    project,
})

export type AppRouter = typeof appRouter

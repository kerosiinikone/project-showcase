import { procedure, router } from '.'
import userActions from '@/procedures/user.procedures'
import projectActions from '@/procedures/project.procedures'

const user = router({
    getSupportedProjects: userActions.getSupportedProjects,
    getAggregatedSupports: userActions.getAggregatedSupports,
    createNewUserAction: userActions.createUserAction,
    getExistingUserAction: userActions.getExistingUserAction,
    getUserRepos: userActions.getUserRepos,
    getGithubUserBio: userActions.getGithubUserBio,
})

const project = router({
    editProject: projectActions.editProject,
    createProject: projectActions.createProject,
    isFollowProject: projectActions.isFollowProject,
    getProjectsById: projectActions.getProjectsById,
    getProjects: projectActions.getProjectsByQuery,
    getProjectById: projectActions.getProjectById,
    deleteProjectById: projectActions.deleteProjectById,
    followProject: projectActions.followProject,
    unfollowProject: projectActions.unfollowProject,
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

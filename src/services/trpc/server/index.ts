import 'server-only'

import { appRouter } from '../router'

export const {
    project: {
        getProjects,
        followProject,
        isFollowProject,
        getProjectsById: getProjectsByIdServer,
        getProjectById: getProjectServer,
        deleteProjectById: deleteProjectServer,
        createProject: createProjectServer,
    },
    user: {
        getAggregatedSupports,
        getUserRepos: getRepos,
        getGithubUserBio: getBio,
        getExistingUserAction: getUserById,
    },
} = appRouter.createCaller({
    session: null, // Can't be set Async
})

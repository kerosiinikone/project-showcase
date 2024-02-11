import 'server-only'

import { appRouter } from '../router'

// Naming consistency !!!

export const {
    project: {
        editProject,
        unfollowProject,
        getProjects,
        followProject,
        isFollowProject,
        getProjectsById: getProjectsByIdServer,
        getProjectById: getProjectServer,
        deleteProjectById: deleteProjectServer,
        createProject: createProjectServer,
    },
    user: {
        getSupportedProjects,
        getAggregatedSupports,
        getUserRepos: getRepos,
        getGithubUserBio: getBio,
        getExistingUserAction: getUserById,
    },
} = appRouter.createCaller({
    session: null, // Can't be set Async
})

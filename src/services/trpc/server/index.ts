import 'server-only'

import { appRouter } from '../router'

export const {
    project: {
        getProjects,
        followProject,
        getProjectsById: getProjectsByIdServer,
        getProjectById: getProjectServer,
        deleteProjectById: deleteProjectServer,
        createProject: createProjectServer,
    },
    user: {
        getUserRepos: getRepos,
        getExistingUserAction: getUserById,
    },
} = appRouter.createCaller({
    session: null, // Can't be set Async
})

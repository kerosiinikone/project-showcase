import 'server-only'

import { appRouter } from '../router'

export const {
    project: {
        getProjects: getProjectsServer,
        getProjectById: getProjectServer,
        deleteProjectById: deleteProjectServer,
        createProject: createProjectServer,
    },
    user: { getUserRepos: getRepos },
} = appRouter.createCaller({
    session: null, // Can't be set Async
})

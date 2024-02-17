import { ProjectTypeWithId } from '@/models/Project/types'
import { UserSchema } from '@/models/User/model'
import { UserType } from '@/models/User/types'
import {
    createNewUser,
    getAggregatedSupportCount,
    getAggregatedSupports,
    getExistingUserById,
    getSupportedProjectsById,
} from '@/operations/user.operations'
import { GithubAccountDBAdapter } from '@/services/auth'
import GithubApp from '@/services/octokit'
import { UserRepo } from '@/services/octokit/types'
import { protectedProcedure } from '@/services/trpc/middleware'
import { z } from 'zod'

export default {
    createUserAction: protectedProcedure
        .input(UserSchema)
        .mutation(async ({ input }) => {
            try {
                return (await createNewUser(input as UserType))[0]
            } catch (error) {
                throw error
            }
        }),
    getExistingUserAction: protectedProcedure.query(
        async ({ ctx: { session } }) => {
            return await getExistingUserById(session?.user?.id!)
        }
    ),
    getAggregatedSupportCount: protectedProcedure.query(
        async ({ ctx: { session } }) => {
            return await getAggregatedSupportCount(session?.user?.id!)
        }
    ),
    getAggregatedSupportsList: protectedProcedure
        .input(z.number())
        .query(async ({ ctx: { session }, input }) => {
            const projects = await getAggregatedSupports(
                session?.user?.id!,
                input
            )
            return {
                data: projects,
                nextCursor: projects.length
                    ? projects[projects.length - 1]?.id!
                    : null,
            }
        }),
    getSupportedProjects: protectedProcedure
        .input(z.string().optional())
        .query(async ({ ctx: { session }, input }) => {
            const projects = await getSupportedProjectsById(
                session?.user?.id!,
                input
            )
            return {
                data: projects,
                nextCursor: projects.length
                    ? projects[projects.length - 1]?.id
                    : null,
            }
        }),
    getUserRepos: protectedProcedure.query(
        async ({ ctx: { session } }) => {
            // Instead of creating a GithubApp instance every time a user click on the button,
            // there should a context-like structure that provides the instance first created
            // in a successful auth callback

            // access_token must be treated like a password, so use bcrypt

            try {
                const access_token =
                    await GithubAccountDBAdapter.getGithubAccessToken(
                        session?.user?.id!
                    )

                const githubInstance = new GithubApp(access_token)
                const repos = await githubInstance.getUserRepos()

                return repos.map((repo) => {
                    return {
                        id: repo.id,
                        name: repo.name,
                        github_url: repo.html_url,
                    }
                }) as UserRepo[]
            } catch (error) {
                return [] as UserRepo[]
            }
        }
    ),
    getGithubUserBio: protectedProcedure.query(
        async ({ ctx: { session } }) => {
            // Instead of creating a GithubApp instance every time a user click on the button,
            // there should a context-like structure that provides the instance first created
            // in a successful auth callback

            // access_token must be treated like a password, so use bcrypt

            try {
                const access_token =
                    await GithubAccountDBAdapter.getGithubAccessToken(
                        session?.user?.id!
                    )

                const githubInstance = new GithubApp(access_token)
                return (await githubInstance.getUserBio()) as string
            } catch (error) {
                return ''
            }
        }
    ),
}

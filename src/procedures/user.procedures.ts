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
import {
    UserRepo,
    UserRepoResponse,
    UserResponse,
} from '@/services/github'
import { protectedProcedure } from '@/services/trpc/middleware'
import { z } from 'zod'

const BASE_HEADERS = {
    'X-GitHub-Api-Version': '2022-11-28',
}

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
            const res = await getAggregatedSupports(
                session?.user?.id!,
                input
            )
            return {
                data: res,
                nextCursor: res.length
                    ? res[res.length - 1]?.project.id
                    : null,
            }
        }),
    getSupportedProjects: protectedProcedure
        .input(z.number().optional())
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
            // access_token must be treated like a password, so use bcrypt

            try {
                const access_token =
                    await GithubAccountDBAdapter.getGithubAccessToken(
                        session?.user?.id!
                    )
                const data = await fetch(
                    `https://api.github.com/users/${session?.user?.name}/repos`,
                    {
                        headers: {
                            ...BASE_HEADERS,
                            Authorization: `Bearer ${access_token}`,
                        },
                    }
                )
                const repos = await data.json()

                return repos.map((repo: any) => {
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
            // access_token must be treated like a password, so use bcrypt

            try {
                const access_token =
                    await GithubAccountDBAdapter.getGithubAccessToken(
                        session?.user?.id!
                    )
                const data = await fetch(
                    `https://api.github.com/users/${session?.user?.name}`,
                    {
                        headers: {
                            ...BASE_HEADERS,
                            Authorization: `Bearer ${access_token}`,
                        },
                    }
                )
                const { bio } = await data.json()

                return bio as string
            } catch (error) {
                return ''
            }
        }
    ),
}

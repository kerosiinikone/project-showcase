import { UserType } from '@/models/User/types'
import { UserSchema } from '@/models/User/validation'
import {
    createNewUser,
    getAggregatedSupportCount,
    getAggregatedSupports,
    getExistingUserById,
    getGithubAccessToken,
    getSupportedProjectsById,
} from '@/operations/user.operations'
import { UserRepo } from '@/services/github'
import { protectedProcedure } from '@/services/trpc/middleware'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import * as winston from 'winston'

const BASE_HEADERS = {
    'X-GitHub-Api-Version': '2022-11-28',
}

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.cli(),
    transports: [new winston.transports.Console()],
})

export default {
    createUserAction: protectedProcedure
        .input(UserSchema)
        .mutation(async ({ input }) => {
            try {
                return (await createNewUser(input as UserType))[0]
            } catch (error) {
                logger.error('Database error in createUserAction', {
                    error,
                    input,
                })
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Database: Error saving user.',
                })
            }
        }),
    getExistingUserAction: protectedProcedure.query(
        async ({ ctx: { session } }) => {
            try {
                return (await getExistingUserById(
                    session?.user?.id!
                )) as UserType
            } catch (error) {
                logger.error(
                    'Database error in getExistingUserAction',
                    { error, session }
                )
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Database: Error getting user.',
                })
            }
        }
    ),
    getAggregatedSupportCount: protectedProcedure.query(
        async ({ ctx: { session } }) => {
            try {
                return await getAggregatedSupportCount(
                    session?.user?.id!
                )
            } catch (error) {
                logger.error(
                    'Database error in getAggregatedSupportCount',
                    { error, session }
                )
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Database: Error getting support count.',
                })
            }
        }
    ),
    getAggregatedSupportsList: protectedProcedure
        .input(z.number())
        .query(async ({ ctx: { session }, input }) => {
            try {
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
            } catch (error) {
                logger.error(
                    'Database error in getAggregatedSupportsList',
                    { error, input, session }
                )
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Database: Error getting supports.',
                })
            }
        }),
    getSupportedProjects: protectedProcedure
        .input(z.number().optional())
        .query(async ({ ctx: { session }, input }) => {
            try {
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
            } catch (error) {
                logger.error(
                    'Database error in getSupportedProjects',
                    { error, input, session }
                )
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message:
                        'Database: Error getting supported projects.',
                })
            }
        }),
    getUserRepos: protectedProcedure.query(
        async ({ ctx: { session } }) => {
            if (process.env.ENVIRONMENT === 'test') {
                return []
            }

            try {
                const data = await fetch(
                    `https://api.github.com/users/${session?.user?.name}/repos`,
                    {
                        headers: {
                            ...BASE_HEADERS,
                            Authorization: `Bearer ${session?.user.gh_access_token}`,
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
                logger.error('Database error in getUserRepos', {
                    error,
                    session,
                })
                return [] as UserRepo[]
            }
        }
    ),
    getGithubUserBio: protectedProcedure.query(
        async ({ ctx: { session } }) => {
            // access_token must be treated like a password, so use bcrypt

            try {
                const data = await fetch(
                    `https://api.github.com/users/${session?.user?.name}`,
                    {
                        headers: {
                            ...BASE_HEADERS,
                            Authorization: `Bearer ${session?.user.gh_access_token}`,
                        },
                    }
                )
                const { bio } = await data.json()

                return bio as string
            } catch (error) {
                logger.error('Database error in getGithubUserBio', {
                    error,
                    session,
                })
                return ''
            }
        }
    ),
}

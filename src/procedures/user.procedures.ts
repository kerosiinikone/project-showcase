import { UserSchema } from '@/models/User/model'
import { UserType } from '@/models/User/types'
import {
    createNewUser,
    getExistingUserById,
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
    getExistingUserAction: protectedProcedure
        .input(z.string().length(36))
        .query(async ({ input }) => {
            const id = input
            try {
                return (await getExistingUserById(id))[0]
            } catch (error) {
                throw error
            }
        }),
    getUserRepos: protectedProcedure.query(async ({ ctx: { session } }) => {
        // Instead of creating a GithubApp instance every time a user click on the button,
        // there should a context-like structure that provides the instance first created
        // in a successful auth callback

        // access_token must be treated like a password, so use bcrypt

        try {
            const access_token =
                await GithubAccountDBAdapter.getGithubAccessToken(
                    session?.user.id!
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
    }),
}

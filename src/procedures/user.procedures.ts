import { UserSchema } from '@/models/User/model'
import { UserType } from '@/models/User/types'
import {
    createNewUser,
    getAggregatedSupportUser,
    getExistingUserById,
} from '@/operations/user.operations'
import { GithubAccountDBAdapter } from '@/services/auth'
import GithubApp from '@/services/octokit'
import { UserRepo } from '@/services/octokit/types'
import { protectedProcedure } from '@/services/trpc/middleware'

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
    getAggregatedSupports: protectedProcedure.query(
        async ({ ctx: { session } }) => {
            return await getAggregatedSupportUser(session?.user?.id!)
        }
    ),
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

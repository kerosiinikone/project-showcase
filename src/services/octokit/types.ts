import { Endpoints } from '@octokit/types'

export type UserRepo = {
    id: number
    name: string
    github_url: string
}

export type UserRepoResponse = Endpoints['GET /user/repos']['response']

import { Endpoints } from '@octokit/types'

export type UserRepo = {
    id: number
    name: string
    github_url: string
}

export type UserRepoResponse =
    Endpoints['GET /user/repos']['response']

export type UserResponse =
    Endpoints['GET /users/{username}']['response']

export type ReadmeResponse =
    Endpoints['GET /repos/{owner}/{repo}/readme']['response']

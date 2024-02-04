import { Octokit } from 'octokit'

// Github App instead of Github OAuth App
// Multiple requests?

const HEADERS = {
    'X-GitHub-Api-Version': '2022-11-28',
}

export default class GithubApp {
    /* 
        Github Octokit used for fetching user repo information, etc.
    */

    private instance: Octokit

    constructor(access_token: string) {
        this.instance = new Octokit({
            auth: access_token,
        })
    }

    async getUserRepos() {
        const { data: repos } = await this.instance.request(
            'GET /user/repos',
            {
                headers: HEADERS,
            }
        )
        return repos
    }
    async getUserBio() {
        const {
            data: { bio },
        } = await this.instance.request('GET /user', {
            headers: HEADERS,
        })
        return bio
    }
}

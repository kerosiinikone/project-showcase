import { UserType } from '../User/types'

export enum Stage {
    IDEA = 'IDEA',
    PLAN = 'PLAN',
    DEVELOPMENT = 'DEVELOPMENT',
    FINISHED = 'FINISHED',
    PRODUCTION = 'PRODUCTION',
}

export interface ProjectType {
    description: string | null
    id: string
    name: string
    created_at: Date
    updated_at: Date
    image: string | null
    github_url: string | null
    stage: Stage
    supporters?: any[] // Fix later
    author_id: string
}

export type ProjectWithUser = ProjectType & {
    author: UserType
}

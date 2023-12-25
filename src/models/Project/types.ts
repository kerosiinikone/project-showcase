export enum Stage {
    'IDEA',
    'PLAN',
    'DEVELOPMENT',
    'FINISHED',
    'PRODUCTION',
}

export interface ProjectType {
    id?: string
    name?: string
    description: string
    image?: string | null
    created_at?: Date
    updated_at?: Date
    stage: Stage
    author_id: string
    github_url?: string
}

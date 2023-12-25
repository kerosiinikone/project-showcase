export enum Stage {
    'IDEA' = 'IDEA',
    'PLAN' = 'PLAN',
    'DEVELOPMENT' = 'DEVELOPMENT',
    'FINISHED' = 'FINISHED',
    'PRODUCTION' = 'PRODUCTION',
}

export interface ProjectType {
    id: string
    name: string
    description: string
    image?: string | null
    created_at?: Date
    updated_at?: Date
    stage: Stage
    author_id: string
    github_url?: string
}

import { UserType } from '../User/types'
import type { SchemaProject } from '../../services/db/schema'

export enum Stage {
    IDEA = 'IDEA',
    PLAN = 'PLAN',
    DEVELOPMENT = 'DEVELOPMENT',
    FINISHED = 'FINISHED',
    PRODUCTION = 'PRODUCTION',
}

// For now -> change to implement SchemaProject from schema.ts

export type ProjectType = {
    description: string | null
    name: string
    alt_id: string
    tags?: string[]
    stage: Stage
    github_url: string | null
    image: string | null
    author_id: string
    created_at: Date
    updated_at: Date
    supporters?: any[] // Fix later
}

export type ProjectTypeWithId = ProjectType & {
    id: number
}

export type ProjectWithUser = ProjectTypeWithId & {
    author: UserType
}

export type SupportedProjectType = {
    name: string
    image?: string
    id: string
}

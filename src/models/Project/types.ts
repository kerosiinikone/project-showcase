import { UserType } from '../User/types'
import type { SchemaProject } from '../../services/db/schema'

export enum Stage {
    IDEA = 'IDEA',
    PLAN = 'PLAN',
    DEVELOPMENT = 'DEVELOPMENT',
    FINISHED = 'FINISHED',
    PRODUCTION = 'PRODUCTION',
}

export type ProjectType = SchemaProject & {
    supporters?: any[] // Fix later
}

export type ProjectWithUser = ProjectType & {
    author: UserType
}

export type SupportedProjectType = {
    name: string
    image?: string
    id: string
}

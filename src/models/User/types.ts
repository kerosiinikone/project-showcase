import type { SchemaUser } from '../../services/db/schema'

export type UserType = SchemaUser & {
    own_projects?: any[] // Fix later
    supported_projects?: any[] // Fix later
}

export type UserUpdateType = {
    github_url?: string
    name?: string
    email?: string
    own_projects?: string[]
    emailVerified?: Date
    image?: string
    supported_projects?: string[]
}

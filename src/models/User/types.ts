export interface UserType {
    id: string
    github_url: string
    email: string
    name: string
    own_projects: string[]
    emailVerified?: Date | null
    image?: string | null
    supported_projects: string[]
    created_at?: Date
    updated_at?: Date
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

export interface UserType {
    id: string
    name: string | null
    email: string
    created_at: Date
    updated_at: Date
    image: string | null
    emailVerified: Date | null
    github_url: string | null
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

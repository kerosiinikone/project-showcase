export interface UserType {
    id: string
    github_url: string
    email: string
    name: string
    own_projects: string[]
    emailVerified?: Date | null
    image?: string | null
    projects: string[]
    created_at?: Date
    updated_at?: Date
}

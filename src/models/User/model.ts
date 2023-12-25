import z from 'zod'
import { UserType } from './types'
import { BaseModel, validationMixin } from '../base'

export const UserSchema = z.object({
    id: z.string().length(36),
    name: z.string().min(5).max(191),
    email: z.string().email().max(191),
    own_projects: z.array(z.string().length(36).optional()),
    projects: z.array(z.string().length(36).optional()),
    created_at: z.date(),
    updated_at: z.date(),
    emailVerifid: z.date().optional(),
    image: z.string().max(191).optional(),
})

export class User extends validationMixin(BaseModel) implements UserType {
    name: string | undefined // Mixin type casting
    github_url: string
    id: string | undefined // Mixin type casting
    created_at: Date | undefined // Mixin type casting
    updated_at: Date | undefined // Mixin type casting
    email: string
    emailVerified?: Date | null | undefined
    image?: string | null | undefined
    own_projects: string[]
    projects: string[]

    constructor({
        name,
        id,
        email,
        image = null,
        emailVerified = null,
    }: UserType) {
        super(name, id, image)
        this.email = email
        this.github_url = this.createGithubLink()
        this.emailVerified = emailVerified
        this.own_projects = []
        this.projects = []

        this.validate_schema(UserSchema)
    }

    private createGithubLink() {
        const BASE_LINK = 'https://github.com'
        return `${BASE_LINK}/${this.name}`
    }
}

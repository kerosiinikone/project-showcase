import z, { ZodError } from 'zod'
import { UserType } from './types'
import { ValidationError } from '../validationError'

export const UserSchema = z.object({
    id: z.string().length(36),
    name: z.string().min(5).max(191),
    email: z.string().email().max(191),
    // own_projects: z.array(z.string().length(36).optional()),
    // supported_projects: z.array(z.string().length(36).optional()),
    created_at: z.date(),
    updated_at: z.date(),
    emailVerifid: z.date().optional(),
    image: z.string().max(191).optional(),
})

export class User implements UserType {
    name: string | null
    github_url: string
    id: string
    created_at: Date
    updated_at: Date
    email: string
    emailVerified: Date | null
    image: string | null

    constructor({
        id,
        name,
        email,
        image,
        emailVerified = null,
    }: UserType) {
        this.email = email
        this.id = id
        this.github_url = this.createGithubLink()
        this.emailVerified = emailVerified
        this.image = image
        this.created_at = new Date()
        this.updated_at = new Date()
        this.name = name

        this.validate_schema()
    }

    private createGithubLink() {
        const BASE_LINK = 'https://github.com'
        return `${BASE_LINK}/${this.name}`
    }

    private validate_schema(): void {
        try {
            UserSchema.parse(this)
        } catch (error) {
            if (error instanceof ZodError) {
                throw new ValidationError('Validation Failed', error)
            } else {
                throw error
            }
        }
    }
}

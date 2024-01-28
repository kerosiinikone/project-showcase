import { ProjectType, Stage } from './types'
import z from 'zod'

const DEFAULT_DESCRIPTION = 'A Project'
const GITHUB_PREFIX = 'https://github.com/'

export const ProjectSchema = z.object({
    name: z.string().min(5).max(191),
    stage: z.nativeEnum(Stage),
    github_url: z.string().max(2000).nullable(),
    description: z.string().nullable(),
    image: z.string().max(191).nullable(),
})

export class Project implements ProjectType {
    description: string | null
    id: string
    name: string
    created_at: Date
    updated_at: Date
    image: string | null
    github_url: string | null
    stage: Stage
    author_id: string

    constructor({
        id,
        name,
        image = null,
        description,
        author_id,
        github_url = null,
        stage,
    }: ProjectType) {
        this.name = name
        this.image = image
        this.github_url = github_url
        this.id = id
        this.created_at = new Date()
        this.updated_at = new Date()
        this.description = description || DEFAULT_DESCRIPTION
        this.author_id = author_id
        this.stage = stage

        this.validateGithub()
    }

    private validateGithub() {
        if (
            this.github_url &&
            !this.github_url.startsWith(GITHUB_PREFIX)
        ) {
            // Change to ValidationError
            throw new Error('Invalid Github Url')
        }
    }
}

import { uuid } from 'uuidv4'
import { ProjectType, Stage } from './types'
import z from 'zod'

const DEFAULT_DESCRIPTION = 'A Project'

export const ProjectSchema = z.object({
    name: z.string().min(5).max(191),
    stage: z.nativeEnum(Stage),
    github_url: z.string().optional(),
    description: z.string().default('A project'),
    image: z.string().max(191).optional(),
})

export class Project implements ProjectType {
    id: string
    name: string
    description: string
    image: string | null | undefined
    author_id: string
    stage: Stage
    github_url?: string | undefined
    created_at: Date
    updated_at: Date

    constructor({
        name,
        image = null,
        description = DEFAULT_DESCRIPTION,
        author_id,
        stage,
    }: ProjectType) {
        this.name = name
        this.image = image
        this.id = uuid()
        this.created_at = new Date()
        this.updated_at = new Date()
        this.description = description
        this.author_id = author_id
        this.stage = stage
    }
}

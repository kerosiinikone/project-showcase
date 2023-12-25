import { BaseModel, validationMixin } from '../base'
import { ProjectType, Stage } from './types'

import z from 'zod'

export const ProjectSchema = z.object({
    id: z.string().length(36),
    name: z.string().min(5).max(191),
    created_at: z.date(),
    updated_at: z.date(),
    stage: z.nativeEnum(Stage),
    github_url: z.string().optional(),
    description: z.string().default('A project'),
    image: z.string().max(191).optional(),
})

export class Project extends validationMixin(BaseModel) implements ProjectType {
    id: string | undefined // Mixin type casting
    name: string | undefined // Mixin type casting
    description: string
    image: string | null | undefined
    author_id: string
    stage: Stage
    github_url?: string | undefined
    created_at: Date | undefined // Mixin type casting
    updated_at: Date | undefined // Mixin type casting

    constructor({
        id,
        name,
        image,
        description,
        author_id,
        stage,
    }: ProjectType) {
        super(id, name, image)
        this.description = description
        this.author_id = author_id
        this.stage = stage

        this.validate_schema(ProjectSchema)
    }
}

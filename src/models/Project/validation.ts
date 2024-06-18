import { z } from 'zod'
import { Stage } from './types'

export const ProjectSchema = z.object({
    name: z
        .string()
        .min(5, 'Name Too Short')
        .max(50, 'Name Too Long'),
    website: z.string().max(80).optional().nullable(),
    stage: z.nativeEnum(Stage),
    github_url: z.string().max(2000).nullable(),
    description: z.string().nullable(),
    tags: z.array(z.string().max(15)).max(3).optional(), // Change max according to need
})

export const PartialProjectSchema = ProjectSchema.partial()

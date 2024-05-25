import { z } from 'zod'

export const UserSchema = z.object({
    id: z.string().length(36),
    name: z.string().min(5),
    email: z.string().email(),
    // own_projects: z.array(z.string().length(36).optional()),
    // supported_projects: z.array(z.string().length(36).optional()),
    // created_at: z.date(),
    // updated_at: z.date(),
    emailVerifid: z.date().optional(),
    image: z.string().optional(),
    emailVerified: z.boolean().optional().nullable(),
})

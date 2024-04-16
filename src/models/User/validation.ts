import { z } from 'zod'

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

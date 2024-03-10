import { projects } from '@/services/db/schema'
import { CursorConfig, generateCursor } from 'drizzle-cursor'

const cursorConfig: CursorConfig = {
    primaryCursor: {
        order: 'DESC',
        key: 'id',
        schema: projects.id,
    },
}

export const cursor = generateCursor(cursorConfig)

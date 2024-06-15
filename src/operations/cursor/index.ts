import { projects, usersToProjects } from '@/services/db/schema'
import { CursorConfig, generateCursor } from 'drizzle-cursor'

const pCursorConfig: CursorConfig = {
    primaryCursor: {
        order: 'DESC',
        key: 'id',
        schema: projects.id,
    },
}

const pTUCursorConfig: CursorConfig = {
    primaryCursor: {
        order: 'DESC',
        key: 'id',
        schema: usersToProjects.project_id,
    },
}

export const projectsCursor = generateCursor(pCursorConfig)
export const usersToProjectsCursor = generateCursor(pTUCursorConfig)

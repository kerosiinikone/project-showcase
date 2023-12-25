import { Project } from '@/models/Project/model'
import { ProjectType } from '@/models/Project/types'
import { projects } from '@/services/db/schema'
import db from '../services/db.server'

export async function createNewProject(newProject: ProjectType) {
    // Need for validate_schema here?
    const project = new Project(newProject)
    return await db.insert(projects).values(project).returning()
}

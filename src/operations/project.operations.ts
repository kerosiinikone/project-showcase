import { Project } from '@/models/Project/model'
import { ProjectType } from '@/models/Project/types'
import { projects } from '@/services/db/schema'
import db from '../services/db.server'

export default async function createProject(newProject: ProjectType) {
    const project = new Project(newProject)
    return await db
        .insert(projects)
        .values({
            ...project,
            id: project.id!,
            name: project.name!,
            createdAt: project.created_at!,
            updatedAt: project.updated_at!,
        })
}

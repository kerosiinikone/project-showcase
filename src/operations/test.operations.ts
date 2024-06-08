import * as testSchema from '@/services/db/schema/test'
import * as database from '../services/db.server'
import { Stage } from '@/models/Project/types'
import { desc, eq } from 'drizzle-orm'

type PartialTestProjectInput = {
    description: string | null
    name: string
    alt_id: string
    tags?: string[] | undefined
    website?: string | null | undefined
    stage: Stage
    github_url: string | null
    image: string | null
    author_id: string
    supporters?: any[] | undefined
}

const testDb = database?.default.testDb

export async function testCreateNewProject(
    newProject: PartialTestProjectInput
) {
    return await testDb!
        .insert(testSchema.projects)
        .values(newProject)
        .returning()
        .then((res) => res[0] ?? null)
}

export async function testGetExistingProjects() {
    return await testDb!
        .select()
        .from(testSchema.projects)
        .orderBy(desc(testSchema.projects.id))
        .limit(1)
}

export async function testGetExistingProjectById({
    id,
}: {
    id: number
}) {
    const data = testDb!.query.projects.findFirst({
        where: eq(testSchema.projects.id, id),
        with: {
            tags: {
                with: {
                    tag: {
                        columns: {
                            name: true,
                        },
                    },
                },
            },
            author: true,
        },
    })

    // Mock
    const supportData = {
        value: 0,
    }

    const [project, supportCount] = await Promise.all([
        data,
        supportData,
    ])

    return {
        ...project,
        supportCount: supportCount.value,
        tags: project?.tags.map((t) => t.tag.name),
    }
}

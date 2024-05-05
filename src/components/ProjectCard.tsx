import { ProjectTypeWithId } from '@/models/Project/types'
import { Github } from 'lucide-react'
import Link from 'next/link'
import { memo } from 'react'

interface ProjectCardProps {
    project: ProjectTypeWithId
}

const STAGE_CLASS_BASE = 'font-normal truncate'

const STAGE_COLORS = {
    IDEA: 'text-red-300',
    PLAN: 'text-orange-300',
    DEVELOPMENT: 'text-emerald-300',
    FINISHED: 'text-blue-300',
    PRODUCTION: 'text-indigo-300',
}

function ProjectCard({ project }: ProjectCardProps) {
    const { id, name, description, stage, author_id, github_url } =
        project as ProjectTypeWithId

    return (
        <div
            id="project-card"
            className={`cursor-pointer rounded-lg h-84 w-84 border-gray-200 border-2 bg-white shadow-md`}
        >
            <Link href={`/projects/${id}`}>
                <div className="flex flex-col h-full w-full p-5 justify-between">
                    <div className="flex flex-col h-full w-full">
                        <h1 className="font-medium text-2xl truncate">
                            {name}
                        </h1>
                        <h2
                            id="status"
                            className={
                                STAGE_COLORS[stage] +
                                ' ' +
                                STAGE_CLASS_BASE
                            }
                        >
                            {stage}
                        </h2>
                        <h2 className="font-normal leading-7 my-2 text-wrap h-20 truncate line-clamp-3">
                            {description}
                        </h2>
                    </div>
                    <div className="flex flex-row justify-between">
                        <div className="flex flex-col w-2/3">
                            <span className="font-medium">
                                Author
                            </span>
                            <span className="font-normal truncate">
                                {author_id}
                            </span>
                        </div>
                        {github_url && (
                            <div
                                id="github-icon"
                                className="flex flex-col w-fit justify-end"
                            >
                                <Github />
                            </div>
                        )}
                    </div>
                </div>
            </Link>
        </div>
    )
}

export default memo(
    ProjectCard,
    (prev: ProjectCardProps, next: ProjectCardProps) => {
        return prev.project.id == next.project.id
    }
)

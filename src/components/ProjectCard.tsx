import { ProjectTypeWithId } from '@/models/Project/types'
import { Github } from 'lucide-react'
import Link from 'next/link'
import { memo } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from './ui/card'

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
        <Link href={`/projects/${id}`}>
            <Card className="cursor-pointer rounded-lg flex flex-col h-84 w-84 border-gray-200 border-2 bg-white shadow-md">
                <CardHeader>
                    <CardTitle>{name}</CardTitle>
                    <CardDescription
                        id="status"
                        className={
                            STAGE_COLORS[stage] +
                            ' ' +
                            STAGE_CLASS_BASE
                        }
                    >
                        {stage}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="font-normal py-2 text-wrap h-20 overflow-hidden line-clamp-3">
                        {description}
                    </p>
                </CardContent>
                <CardFooter className="flex flex-row justify-between">
                    <div className="flex flex-col w-2/3">
                        <span className="font-medium">Author</span>
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
                </CardFooter>
            </Card>
        </Link>
    )
}

export default memo(
    ProjectCard,
    (prev: ProjectCardProps, next: ProjectCardProps) => {
        return prev.project.id == next.project.id
    }
)

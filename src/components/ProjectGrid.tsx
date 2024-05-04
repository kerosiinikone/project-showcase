import { ProjectTypeWithId } from '@/models/Project/types'
import { lazy } from 'react'
import { Skeleton } from './ui/skeleton'

// Fix resizing the cards

const ProjectCard = lazy(() => import('./ProjectCard'))

interface ProjectGridProps {
    projects: ProjectTypeWithId[]
    onBottom: (e: any) => void
    pending: boolean
}

export default function ProjectGrid({
    projects,
    onBottom,
    pending,
}: ProjectGridProps) {
    return (
        <div
            id="catalog"
            className="grid grid-flow-row-dense grid-cols-4 p-5 gap-4 grid-wrap bg-white overflow-y-auto rounded-lg h-full w-full font-medium border-gradient-to-r from-slate-150 to-slate-50 border-2"
            onScroll={onBottom}
        >
            {projects.map((p) => {
                return (
                    <ProjectCard
                        h={projects.length > 4 ? 'h-full' : 'h-1/2'}
                        key={p.alt_id}
                        project={p}
                    />
                )
            })}
            {pending &&
                [...'x'.repeat(5).split('').keys()].map(() => (
                    <Skeleton className="w-full h-full rounded-lg" />
                ))}
        </div>
    )
}

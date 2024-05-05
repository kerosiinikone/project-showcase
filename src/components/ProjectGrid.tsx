import { ProjectTypeWithId } from '@/models/Project/types'
import { lazy } from 'react'
import { Skeleton } from './ui/skeleton'

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
            className="grid grid-flow-row-dense grid-cols-4 grid-rows-[repeat(4,_1fr)] p-5 gap-4 grid-wrap bg-white overflow-y-auto rounded-lg h-full w-full font-medium border-gradient-to-r from-slate-150 to-slate-50 border-2"
            onScroll={onBottom}
        >
            {projects.map((p) => {
                return <ProjectCard key={p.alt_id} project={p} />
            })}
            {pending &&
                [...'x'.repeat(5).split('').keys()].map((_, i) => (
                    <Skeleton
                        key={i}
                        className="w-full h-full rounded-lg"
                    />
                ))}
        </div>
    )
}
